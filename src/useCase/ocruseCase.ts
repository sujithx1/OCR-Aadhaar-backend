import { AppError } from "../config/apperror";
import { client } from "../config/credential";
import { AadhaarData } from "../types/types";

export class OCRUseCase {
  constructor() {}

  async execute(frontFile: Express.Multer.File, backFile: Express.Multer.File) {
    const [frontResult] = await client.textDetection(frontFile.path);
    const [backResult] = await client.textDetection(backFile.path);

    const frontText = frontResult.textAnnotations?.[0]?.description || "";
    const backText = backResult.textAnnotations?.[0]?.description || "";

    if (frontText == backText) {
      throw new AppError("upload both front and back of aadhaar", 401);
    }

    console.log("full text    ", frontText, backText);
    const combinedText = `${frontText}\n${backText}`;

    const nameMatch = combinedText.match(
      /\n(?:To)?\s*([A-Z][a-zA-Z. ]+)\s*S\/O/i
    );
    const name = nameMatch?.[1]?.trim() || "";

    const dobMatch = combinedText.match(
      /(?:DOB|DON)[\s|:]*([0-9]{2}[\/\-][0-9]{2}[\/\-][0-9]{4})/
    );
    const dob = dobMatch?.[1] || "";

    const aadhaarMatch = combinedText.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
    const aadhaarNumber = aadhaarMatch?.[0] || "";

    const phoneMatch = combinedText.match(/Mobile[:\s]*(\d{10})/i);
    const phoneNumber = phoneMatch?.[1] || "";

    const fatherMatch = combinedText.match(/S\/O[:\s]*([A-Z][a-zA-Z\s.]+)/i);
    const fatherName = fatherMatch?.[1]?.trim() || "";

    const addressMatch = combinedText.match(
      /To\s+((?:.*\n)+?)(?=VTC:|PO:|Sub District:|PIN|Mobile:)/
    );

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

    const issuedDateMatch = combinedText.match(
      /Issue\s*Date[:\s]*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i
    );
    const issuedDate = issuedDateMatch?.[1] || "";

    const data: AadhaarData = {
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

    return data;
  }
}
