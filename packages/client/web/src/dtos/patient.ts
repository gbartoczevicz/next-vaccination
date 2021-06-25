export interface IPatientDTO {
  id: string;
  name: string;
  document: string;
  phone: string;
  avatar: string;
  appointment: {
    date: Date;
    vaccinated_at?: Date;
    cancellated_at?: Date;
  };
}
