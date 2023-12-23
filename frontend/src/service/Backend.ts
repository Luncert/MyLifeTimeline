import Axios from 'axios';
import config from './config';
import { Path } from '../Paths';

const axios = Axios.create({
  baseURL: config.backend.endpoint
});

const colors = {
  streamOpened: 'rgb(63, 62, 77)',
  streamClosed: 'rgb(63, 62, 77)',
  streamingError: 'rgb(189, 69, 65)',
  bg: undefined,
};

class Backend {

  public async getBinary(path: Path): Promise<ArrayBuffer> {
    return axios.get(`/storage/${path}`, {
      responseType: "arraybuffer"
    }).then((rep) => {
      return rep.data;
    });
  }

  public async listFiles(path: Path): Promise<StorageFile[]> {
    return axios.get(`/storage/${path}`, {
      responseType: "json"
    }).then((rep) => {
      return rep.data;
    });
  }

  public async uploadFile(path: Path, file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`/storage/${path}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  public async createDirectory(path: Path): Promise<any> {
    return axios.post(`/storage/${path}`);
  }
}

let instance: Backend;

export default function getBackend() {
  if (!instance) {
    instance = new Backend();
  }
  return instance;
}