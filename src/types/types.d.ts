
 export type AadhaarData = {
  name: string;
  dob: string; // format: 'YYYY-MM-DD' or raw string depending on OCR result
  gender: 'Male' | 'Female' | 'Other' | string|null;
  aadhaarNumber: string;
  address: string;
  pincode: string;
  phoneNumber: string;
  fatherName: string;
  issuedDate: string; // format: 'YYYY-MM-DD' or raw string
};

