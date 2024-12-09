type Event = {
  name: string;
  attended: boolean;
};

export default interface UserData {
  id: number;
  name: string;
  usn: string;
  type: string;
  events?: Event[];
  photoUrl: string;
  aadharUrl: string;
  sslcUrl: string;
  pucUrl: string;
  admissionUrl: string;
  idcardUrl: string;
  userId: string;
};