import Axios from "axios";
export const base_url = 'http://localhost:8080';

export const axios = Axios.create({
  baseURL: base_url
})


const getPlaces = async  () => {
  return   axios('/places')
}

const createNewPlace = (place) => {
  return axios({
    method: 'post',
    url: "/places",
    headers: {},
    data: place
  })
}

const deletePlace = (id) => {
  return axios({
    method: 'DELETE',
    url: `/places/${id}`,
    headers: {},
  })
}

const updatePlace = (data,id) => {
  return   axios({
    method: 'PUT',
    url: `/places/${id}`,
    headers: {},
    data: data
  })
}

export {getPlaces, createNewPlace, deletePlace,updatePlace}

