import multer from 'multer'
import fs from 'fs'
import path from 'path'

let defaultPath = "public"

const storage = multer.diskStorage({
    destination: function (_req, file, cb){
        const isDirectoryExist = fs.existsSync(`${defaultPath}/${file.fieldname}`)
        if(!isDirectoryExist){
            fs.mkdirSync(`${defaultPath}/${file.fieldname}`, { recursive: true })
        }
        cb(null, `${defaultPath}/${file.fieldname}`)
    },
    filename: function (_req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const maxSize = 5 * 1024 * 1024;

const fileFilter = (_req, file, cb) => {
    const fileType = file.mimetype.split('/')[1];
    if (fileType == 'jpeg' || fileType === 'jpg' || fileType === 'png'
        || fileType === 'pdf' || fileType === 'docx', fileType === 'doc'
        || fileType === 'xlsx', fileType === 'xls') {
        cb(null, true);
    } else {
        cb(new Error("Unupported format"), false);
    }
}

const multerUpload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter
})

module.exports = {
    multerUpload
}