'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var settings = require('../../settingsHandler').getGeneralSettings();
var uploadHandler = require('../../engine/uploadHandler.js');
var logger = require('../../logger');

exports.engineVersion = '2.4';

exports.setFfmpegThumb = function () {

  uploadHandler.videoThumbCommand = 'ffmpeg -ss {$starttime} -i {$path} -y -vframes 1 -vf scale=';

  uploadHandler.generateVideoThumb = function(identifier, file, tooSmall, callback) {

    var videoDurationCommand = 'ffprobe -v quiet -print_format json -show_format -show_streams ';

    var path = file.pathInDisk;

    exec(videoDurationCommand + path, function gotDuration(error, output) {

      if (error) {
        callback(error);
      } else {

        var duration = 2;

        if (JSON.parse(output).format) {
          duration = JSON.parse(output).format.duration;
        }

        var command = uploadHandler.videoThumbCommand.replace('{$path}', file.pathInDisk);

        command = command.replace('{$starttime}', Math.floor(duration/2));

        var extensionToUse = settings.thumbExtension || 'png';

        var thumbDestination = file.pathInDisk + '_.' + extensionToUse;

        if (tooSmall) {
          command += '-1:-1';
        } else if (file.width > file.height) {
          command += settings.thumbSize + ':-1';
        } else {
          command += '-1:' + settings.thumbSize;
        }

        command += ' ' + thumbDestination;

        file.thumbMime = logger.getMime(thumbDestination);
        file.thumbOnDisk = thumbDestination;
        file.thumbPath = '/.media/t_' + identifier;

        exec(command, {maxBuffer: Infinity}, function createdThumb(error) {
          if (error || !fs.existsSync(file.thumbOnDisk)) {

            var videoThumbCommandOriginal = 'ffmpeg -i {$path} -y -vframes 1 -vf scale=';

            var commandOriginal = videoThumbCommandOriginal.replace('{$path}', file.pathInDisk);

            var extensionToUse = settings.thumbExtension || 'png';

            var thumbDestination = file.pathInDisk + '_.' + extensionToUse;

            if (tooSmall) {
              commandOriginal += '-1:-1';
            } else if (file.width > file.height) {
              commandOriginal += settings.thumbSize + ':-1';
            } else {
              commandOriginal += '-1:' + settings.thumbSize;
            }

            commandOriginal += ' ' + thumbDestination;

            file.thumbMime = logger.getMime(thumbDestination);
            file.thumbOnDisk = thumbDestination;
            file.thumbPath = '/.media/t_' + identifier;

            exec(commandOriginal, function createdThumb(error) {
              if (error) {
                callback(error);
              } else {
                uploadHandler.transferThumbToGfs(identifier, file, callback);
              }
            });

          } else {
            uploadHandler.transferThumbToGfs(identifier, file, callback);
          }


        });

      }

    });

  };

}

exports.init = function() {

  exports.setFfmpegThumb();

};