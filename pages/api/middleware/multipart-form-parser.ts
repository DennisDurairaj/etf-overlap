import formidable from "formidable";
import { IncomingMessage } from "http";

const form = formidable({ multiples: true }); // multiples means req.files will be an array

interface ExtendedIncomingMessage extends IncomingMessage {
  files: formidable.Files;
  body: formidable.Fields;
}

export default function parseMultipartForm(
  req: ExtendedIncomingMessage,
  res: any,
  next: () => void
) {
  const contentType = req.headers["content-type"];
  if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
    form.parse(req, (err, fields, files) => {
      if (!err) {
        req.files = files;
        req.body = fields;
      }
      next(); // continues to the next middleware or to the route
    });
  } else {
    next();
  }
}
