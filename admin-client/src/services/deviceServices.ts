import axios from 'axios';

class DeviceService {

  private static baseUrl = "https://3zenzw56nf.us-west-2.awsapprunner.com" + '/api/device-manager/devices';

  static async getAll(): Promise<Device[]> {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  static async getById(id: number): Promise<Device> {
    const response = await axios.get<Device>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  static async create(device: Device): Promise<Device> {
    const response = await axios.post<Device>(this.baseUrl, device);
    return response.data;
  }

  static async update(id: number, device: Device): Promise<Device> {
    const response = await axios.put<Device>(`${this.baseUrl}/${id}`, device);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}
export default DeviceService;

