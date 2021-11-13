import { render, screen,cleanup,waitFor } from '@testing-library/react';
import axiosMock from "axios"
import App from './App';
import MapContainer from "./containers/mapContainer";
import ObjectDetailModal from "./components/showObjDetails";
jest.mock("axios");

afterEach(cleanup)

test('Render the Application HomePage', () => {
  render(<App />);
  const linkElement = screen.getByText('Home');
  expect(linkElement).toBeInTheDocument();
});

it("Check Either Fetch Api Work at componentDidMount",async ()=>{
  axiosMock.get.mockResolvedValueOnce({data:{ greeting:"The Metropolitan Museum of Art"}})
  const {getByTestId} = render(<MapContainer/>)
  expect(getByTestId('loading Data')).toBeInTheDocument()
  await waitFor(() => {
    expect(getByTestId("resolved")).toHaveTextContent("The Metropolitan Museum of Art");
  });
})

it("Failed the Test the Object Details Work",async ()=>{
  let data = {}
  const resetObjKey = () => {}
  const {getByTestId} = render(<ObjectDetailModal   selectedObject={data}
                                                    visible={true}
                                                    resetObjKey={resetObjKey}/>)
  await waitFor(() => {
    expect(getByTestId("object_with_no_data")).toHaveTextContent("No Data");
  });
  // expect(getByTestId('object_details')).toHaveTextContent("Department")

})

