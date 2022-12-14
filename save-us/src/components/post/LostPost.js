import React, { useState } from 'react';
import PostImg from './LostPostImg';
import ModalButton from '../modal/ModalButton';
import LostPostMap from './LostPostMap';

export default function InputData() {
  const [animalName, setAnimalName] = useState();
  const [animalSpecies, setAnimalSpecies] = useState('');
  const [lostDate, setLostDate] = useState('');
  // const [animalAge, setAnimalAge] = useState(0);
  // const [animalColor, setAnimalColor] = useState('');
  // const [animalSex, setAnimalSex] = useState('');
  // const [animalNeuter, setAnimalNeuter] = useState(false);
  const [phoneNumber1, setPhoneNumber1] = useState();
  const [phoneNumber2, setPhoneNumber2] = useState();
  const [detail, setDetail] = useState('');
  const [address, setAddress] = useState('');
  const [addressName, setAddressName] = useState('');
  const [radius, setRadius] = useState();
  // const [image, setImage] = useState();

  const handleChangeAnimalName = ({ target: { value } }) =>
    setAnimalName(value);
  const handleAnimalSpecies = ({ target: { value } }) =>
    setAnimalSpecies(value);
  const handleLostDate = ({ target: { value } }) => setLostDate(value);
  // const handleAnimalAge = ({ target: { value } }) => setAnimalAge(value);
  // const handleAnimalColor = ({ target: { value } }) => setAnimalColor(value);
  // const handleAnimalSex = ({ target: { value } }) => setAnimalSex(value);
  // const handleAnimalNeuter = ({ target: { value } }) => setAnimalNeuter(value);
  const handlePhoneNumber1 = ({ target: { value } }) => setPhoneNumber1(value);
  const handlePhoneNumber2 = ({ target: { value } }) => setPhoneNumber2(value);
  const handleDetail = ({ target: { value } }) => setDetail(value);
  const handleRadius = ({ target: { value } }) => setRadius(value);

  const onSubmit = async (event) => {
    event.preventDefault();

    const resp = await fetch('http://localhost:5000/api/lost/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        animalName,
        lostDate,
        address: addressName,
        detail,
        image: 'ss',
        processState: 'lost',
        latitude: address.lat,
        longitude: address.lng,
      }),
    });
    const result = await resp.json();
    console.log(result);
    console.log(addressName);
  };

  return (
    <form>
      ?????? ?????? ??????{' '}
      <input
        name="?????? ?????? ??????"
        value={animalName}
        type="string"
        onChange={handleChangeAnimalName}
      />
      ??????{' '}
      <input
        type="text"
        list="animalSpecies"
        value={animalSpecies}
        onChange={handleAnimalSpecies}
      />
      <datalist id="animalSpecies">
        <option value="?????????">?????????</option>
        <option value="??????">??????</option>
        <option value="??????">??????</option>
      </datalist>
      <br />
      ?????? ?????? <input type="date" value={lostDate} onChange={handleLostDate} />
      ?????? ??????
      <ModalButton
        buttonName="?????? ??????"
        title="??????"
        content={
          <LostPostMap
            address={address}
            setAddress={setAddress}
            addressName={addressName}
            setAddressName={setAddressName}
          />
        }
      />
      <p>{addressName}</p>
      <br />
      <br />
      ????????? ?????????1{' '}
      <input
        type="tel"
        value={phoneNumber1}
        onChange={handlePhoneNumber1}
      />{' '}
      <br />
      ????????? ?????????2{' '}
      <input
        type="tel"
        value={phoneNumber2}
        onChange={handlePhoneNumber2}
      />{' '}
      <br />
      ?????? ?????? <input
        type="text"
        value={detail}
        onChange={handleDetail}
      />{' '}
      <br />
      ???????????? ?????? ??????(km)
      <input type="number" value={radius} onChange={handleRadius} />
      <PostImg />
      <br />
      <button type="submit" onClick={onSubmit}>
        ????????????
      </button>
    </form>
  );
}
