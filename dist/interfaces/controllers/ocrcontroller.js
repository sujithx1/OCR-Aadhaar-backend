"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OCRcontroller = void 0;
const vision_1 = require("@google-cloud/vision");
const apperror_1 = require("../../config/apperror");
const errorcodes_1 = require("../../config/errorcodes");
const credentials = {
    type: process.env.GOOGLE_VISION_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};
const client = new vision_1.ImageAnnotatorClient({
    // keyFilename: path.join(__dirname, "../../../gcp-key.json"),
    credentials: credentials,
});
class OCRcontroller {
    async _ocrpost(req, res, next) {
        try {
            if (!req.files) {
                return next(new apperror_1.AppError(errorcodes_1.ErrorCodes.Image_missing, 401));
            }
            const frontFile = req.files["frontImage"]?.[0];
            const backFile = req.files["backImage"]?.[0];
            if (!frontFile || !backFile)
                return res.status(400).send("Both images required");
            const [frontResult] = await client.textDetection(frontFile.path);
            const [backResult] = await client.textDetection(backFile.path);
            const frontText = frontResult.textAnnotations?.[0]?.description || "";
            const backText = backResult.textAnnotations?.[0]?.description || "";
            if (frontText == backText) {
                return next(new apperror_1.AppError("upload both front and back of aadhaar", 401));
            }
            console.log("full text    ", frontText, backText);
            const combinedText = `${frontText}\n${backText}`;
            const nameMatch = combinedText.match(/\n(?:To)?\s*([A-Z][a-zA-Z. ]+)\s*S\/O/i);
            const name = nameMatch?.[1]?.trim() || "";
            const dobMatch = combinedText.match(/(?:DOB|DON)[\s|:]*([0-9]{2}[\/\-][0-9]{2}[\/\-][0-9]{4})/);
            const dob = dobMatch?.[1] || "";
            const aadhaarMatch = combinedText.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
            const aadhaarNumber = aadhaarMatch?.[0] || "";
            const phoneMatch = combinedText.match(/Mobile[:\s]*(\d{10})/i);
            const phoneNumber = phoneMatch?.[1] || "";
            const fatherMatch = combinedText.match(/S\/O[:\s]*([A-Z][a-zA-Z\s.]+)/i);
            const fatherName = fatherMatch?.[1]?.trim() || "";
            const addressMatch = combinedText.match(/To\s+((?:.*\n)+?)(?=VTC:|PO:|Sub District:|PIN|Mobile:)/);
            const genderMatch = combinedText.match(/\b(Male|Female|Others?)\b/i);
            // Infer from relational keywords (S/O or D/O)
            const inferredGender = combinedText.match(/\bS\/O\b/i)
                ? "Male"
                : combinedText.match(/\bD\/O\b/i)
                    ? "Female"
                    : null;
            let gender = genderMatch?.[1] || inferredGender || null;
            console.log("gender", gender);
            let address = addressMatch?.[1]?.replace(/\s+/g, " ").trim() || "";
            const pinMatch = combinedText.match(/\bPIN\s*Code[:\s]*(\d{6})/i);
            const pincode = pinMatch?.[1] || "";
            if (pincode && !address.includes(pincode)) {
                address += `, ${pincode}`;
            }
            const issuedDateMatch = combinedText.match(/Issue\s*Date[:\s]*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
            const issuedDate = issuedDateMatch?.[1] || "";
            const data = {
                name,
                dob,
                gender,
                aadhaarNumber,
                address,
                pincode,
                phoneNumber,
                fatherName,
                issuedDate,
            };
            console.log("Extracted Aadhaar Data:", data);
            res
                .status(200)
                .json({ success: true, data, message: "Parssing Success" });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.OCRcontroller = OCRcontroller;
