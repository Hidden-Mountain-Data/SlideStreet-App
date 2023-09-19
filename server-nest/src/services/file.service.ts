// file.service.ts
import { Injectable, Res, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

import { v4 as uuidV4 } from 'uuid';
import sharp = require('sharp');

const UPLOAD_PATH = 'uploads'
const PLACEHOLDERS_PATH = 'placeholders'
import { createReadStream } from 'fs';

@Injectable()
export class FileService {
    async transformAndSave(image: string): Promise<string> {
        const base64Image = image.split(';base64,').pop(); // Remove data URL part
        const decodedImage = Buffer.from(base64Image, 'base64');
        const fileUuid =  uuidV4();
        const filename = fileUuid + '.jpg';

        try {
            await sharp(decodedImage.buffer)
                .resize(800)
                .webp({ effort: 3 })
                .toFile(path.join(UPLOAD_PATH, filename));
        } catch (e) {
            console.error(e)
        }
        return fileUuid;
    }

    async userPlaceholderImageAndSave(): Promise<string> {
        const fileUuid = '81c13d3e-8b27-42aa-9182-bfe1a7dd7264';
        const filename = fileUuid + '.jpg';

        try {
            await sharp(path.join(PLACEHOLDERS_PATH+'/profile', filename))
                .resize(800)
                .webp({ effort: 3 })
                .toFile(path.join(UPLOAD_PATH, filename));
        } catch (e) {
            console.error(e)
        }
        return fileUuid;
    }

    async serveImage(filename: string): Promise<any> {
        try {
            const imagePath = path.join(UPLOAD_PATH, filename+'.jpg');
            const imageStream = createReadStream(imagePath);
            return imageStream;
        } catch (e) {
            console.log(e)
        }
    }

    checkAndCreateUploadsDirectory() {
        const directoryPath = './uploads'; // Replace with your desired directory path
    
        // Check if the directory exists
        if (!fs.existsSync(directoryPath)) {
          // If it doesn't exist, create it
          fs.mkdirSync(directoryPath);
          console.log(`Directory '${directoryPath}' created.`);
        } else {
          console.log(`Directory '${directoryPath}' already exists.`);
        }
      }

      async copyFiles(sourceDir, destinationDir) {
        try {
          // Get a list of all files in the source directory
          const files = fs.readdirSync(sourceDir);
      
          // Loop through the files and copy each one to the destination directory
          for (const file of files) {
            const sourcePath = path.join(sourceDir, file);
            const destinationPath = path.join(destinationDir, file);
      
            // Check if the file already exists in the destination directory
            if (!fs.existsSync(destinationPath)) {
              // Use fs.promises.copyFile to copy the file
              await fs.promises.copyFile(sourcePath, destinationPath);
              console.log(`Copied: ${file}`);
            } else {
              console.log(`Skipped (already exists): ${file}`);
            }
          }
      
          console.log('Files copied successfully.');
        } catch (error) {
          console.error('Error copying files:', error);
        }
      }
}
