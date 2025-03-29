export default class Appointment {
  constructor(id, patientName, doctorId, serviceId, startTime, endTime) {
    this.id = id;
    this.patientName = patientName;
    this.doctorId = doctorId;
    this.serviceId = serviceId;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  getDuration() {
    const start = new Date(this.startTime);
    const end = new Date(this.endTime);
    return (end - start) / (1000 * 60);
  }
}
