import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Creatable from "react-select/creatable";

export default function SightingForm(props) {
  // state to handle  the form
  const [locationDescription, setLocationDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // router hooks
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (props.edit) {
      // API way
      // getSighting();

      // Prop way
      setLocationDescription(props.sighting.locationDescription);
      setNotes(props.sighting.notes);
      setCity(props.sighting.city);
      setCountry(props.sighting.country);
      setDate(props.sighting.date.slice(0, 10));

      let requiredEditTags =
        props.sighting.categories && props.sighting.categories.length > 0
          ? props.sighting.categories.map((category) => {
              return {
                label: category.name,
                value: category.name,
                id: category.id,
                currentValue: category.sighting_category.intensity,
                sightingCategoryId: category.sighting_category.id,
              };
            })
          : null;

      console.log("props.edit", props);

      setValue(requiredEditTags);
    }
  }, []);

  // React Select code implementationation
  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  // React Select create a new category int he DB once the user adds it to the form
  const handleCreate = async (inputValue) => {
    const catData = await axios.post(
      `${process.env.REACT_APP_BACKEND_KEY}/categories`,
      {
        name: inputValue,
      }
    );
    const newOption = createOption(inputValue);
    newOption.id = catData.data.id;
    setOptions((prev) => [...prev, newOption]);
  };

  // Get all categories to dynamically add to React Select options
  const getCategories = async () => {
    let data = await axios.get(
      `${process.env.REACT_APP_BACKEND_KEY}/categories`
    );

    let categoriesArray = data.data.map((element) => {
      return {
        value: element.name.toLowerCase(),
        label: element.name,
        id: element.id,
        currentValue: element.intensity,
      };
    });
    setOptions(categoriesArray);
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Api request to make a new sighting
  const sendSighting = async () => {
    let data = await axios.post(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings`,
      {
        locationDescription,
        city,
        country,
        notes,
        date,
      }
    );
    const sightingId = data.data.id;
    let formattedCategory = value.map((item) => {
      return {
        categoryId: item.id,
        intensity: item.currentValue,
      };
    });

    sendCategorySighting(formattedCategory, sightingId);
    setLocationDescription("");
    setCity("");
    setCountry("");
    setNotes("");
    setDate(new Date().toISOString().slice(0, 10));
    navigate("/sightings");
  };

  // Api request to edit an existing sighting
  const editSighting = async () => {
    const data = await axios.put(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings/${params.sightingId}`,
      {
        locationDescription,
        city,
        country,
        notes,
        date,
      }
    );
    const sightingId = data.data[0];

    const formattedCategory = value.map((item, index) => {
      return {
        categoryId: item.id,
        intensity: item.currentValue,
        sightingCategoryId: item.sightingCategoryId,
      };
    });

    formattedCategory.forEach(async (element) => {
      element.sightingCategoryId === undefined
        ? await axios.post(
            `${process.env.REACT_APP_BACKEND_KEY}/categories/${sightingId}`,
            {
              ...element,
            }
          )
        : await axios.post(
            `${process.env.REACT_APP_BACKEND_KEY}/categories/${sightingId}`,
            {
              ...element,
            }
          );
    });

    setLocationDescription("");
    setCity("");
    setCountry("");
    setNotes("");
    setDate(new Date().toISOString().slice(0, 10));
    navigate("/sightings");
  };

  // API request to make association between sigthing and category
  const sendCategorySighting = async (categoryArray, sightingId) => {
    categoryArray.forEach(async (item) => {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_KEY}/categories/${sightingId}`,
        {
          ...item,
        }
      );
    });
  };

  //  Logic to alter the intensity of the weather pheonmenon
  const editIntensity = (e, element, index) => {
    let newElement = { ...element, currentValue: e.target.value };
    let newValueArray = [...value];
    newValueArray[index] = newElement;
    setValue(newValueArray);
  };

  return (
    <div>
      {/* React Select */}
      <Creatable
        isClearable
        defaultValue={value}
        isMulti
        onChange={(newValue) => {
          setValue(newValue);
        }}
        onCreateOption={handleCreate}
        options={options}
        value={value}
      />
      {/* If there are current categories, display editable intensities */}
      {value && value.length > 0
        ? value.map((element, index) => {
            return (
              <div key={element.id}>
                <label>{element.label}</label>
                <input
                  type="text"
                  value={element.currentValue}
                  name={element.label}
                  onChange={(e) => editIntensity(e, element, index)}
                  max={10}
                  min={0}
                />
                ;
              </div>
            );
          })
        : null}
      ;<label>Location</label>
      <input
        type="text"
        value={locationDescription}
        onChange={(e) => setLocationDescription(e.target.value)}
        placeholder="Enter location here"
      />
      <label>Country</label>
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Enter country here"
      />
      <label>City</label>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city here"
      />
      <label>Notes</label>
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter notes here"
      />
      <label>Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      {/* Depending on the prop value this component is given, it will either be editing or sending a new sighting */}
      <button onClick={props.edit ? editSighting : sendSighting}>
        {props.edit ? "Edit" : "Submit"}
      </button>
    </div>
  );
}

// API way - legacy
// const getSighting = async () => {
//   let data = await axios.get(
//     `${process.env.REACT_APP_BACKEND_KEY}/sightings/${params.sightingId}`
//   );
//   setLocationDescription(props.sighting.locationDescription);
//   setNotes(props.sighting.notes);
//   setCity(props.sighting.city);
//   setCountry(props.sighting.country);
//   setDate(data.data.date.slice(0, 10));
//   console.log(data);
//   let requiredEditTags =
//     props.sighting.categories && props.sighting.categories.length > 0
//       ? props.sighting.categories.map((category) => {
//           return {
//             label: category.name,
//             value: category.name,
//           };
//         })
//       : null;

//   let intensityArray =
//     props.sighting.categories && props.sighting.categories.length > 0
//       ? props.sighting.categories.map((category) => {
//           return category.sighting_category.intensity;
//         })
//       : null;

//   setValue(requiredEditTags);
//   setIntensity(intensityArray);
// };
