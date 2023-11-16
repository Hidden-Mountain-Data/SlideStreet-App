import axios from 'axios';


class DeviceService {
  private baseUrl = process.env.REACT_APP_API_URL + '/api/devices';

  async getAll(): Promise<Device[]> {
    const response = await axios.get<Device[]>(this.baseUrl);
    return response.data;
  }

  async getById(id: number): Promise<Device> {
    const response = await axios.get<Device>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(device: Device): Promise<Device> {
    const response = await axios.post<Device>(this.baseUrl, device);
    return response.data;
  }

  async update(id: number, device: Device): Promise<Device> {
    const response = await axios.put<Device>(`${this.baseUrl}/${id}`, device);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}
export default DeviceService;