import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { PinContext } from '../../context';
import axios from 'axios';

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';

import '@reach/combobox/styles.css';
import './Search.scss';

export default function Search({ panTo }) {
  const { pinInfo, setPinInfo } = useContext(PinContext);
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 100 * 1000,
    },
  });

  // const [pinInfo, setPinInfo] = useState(null);

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });

      const placeId = results[0].place_id; //we'll need this to check the db on search
      console.log('from google', results[0].place_id);

      // check from our db with placeId
      const pinResult = await axios.get(`/pins/place_id/${placeId}`);
      console.log('pinResult', pinResult);

      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });

      setPinInfo(pinResult.data);
    } catch (error) {
      console.log('An error has occurred', error);
    }
  };

  if (pinInfo) {
    if (pinInfo.found) {
      return <Redirect to='/result' />;
    } else {
      return <Redirect to='/new' />;
    }
  }

  return (
    <div className='search'>
      <Combobox onSelect={handleSelect} className='combo-box'>
        <p>Search</p>
        <ComboboxInput
          className='combo-box__input'
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder={`Find by name or address`}
          autoFocus={true}
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === 'OK' &&
              data.map(({ id, description }, index) => (
                <ComboboxOption key={index} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
