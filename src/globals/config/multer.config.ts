import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      const charName = req.params.name;

      if (typeof charName !== 'string') throw new BadRequestException();
      const uploadPath = path.join(__dirname, '..', '..', 'uploads', charName);

      if (!fs.existsSync(uploadPath))
        fs.mkdirSync(uploadPath, { recursive: true });

      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const charName = req.params.name;
      const fileType = req.params.imageType;
      const ext = path.extname(file.originalname);

      const fileName = `${charName}${fileType}${ext}`;
      callback(null, fileName);
    },
  }),
};
