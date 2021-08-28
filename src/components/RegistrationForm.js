import React from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Gender from './Gender';

import { addNotification, setShards, setCid } from "../actions";
import { useDispatch } from "react-redux";

import {
  processJSONfromFORM
} from '../helpers';

const INIT = {
  bride: {
    public: {
      name: "Jane Doe",
      age: "23",
      gender: "female",
    },
    private: {
      identification_no: "1234567890",
    },
  },
  groom: {
    public: {
      name: "Jack Mac",
      age: "24",
      gender: "male",
    },
    private: {
      identification_no: "0987654321",
    },
  },
  witnesses: [
    {
      public: {
        name: "Random Guy",
        age: "34",
        gender: "male",
      },
      private: {
        identification_no: "1592634870",
      },
    },
  ],
  year_of_marriage: "",
  place: "San Deigo, Auckland, Australia",
  files: null,
  errors: null
};

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const [formState, setFormState] = React.useState({ ...INIT });

  const addWitness = () => {
    setFormState({
      ...formState,
      witnesses: [
        ...formState.witnesses,
        {
          public: {
            name: "",
            age: "",
            created_on: Date.now(),
            gender: "",
          },
          private: {
            identification_no: "",
          },
        },
      ],
    });
  };

  const handleChange = async (e, type, mode, key, index) => {
    const changeState = formState;
    // console.log(type, mode, key, index);
    switch (type) {
      case "bride":
        changeState[type][mode][key] = e.target.value;
        break;
      case "groom":
        changeState[type][mode][key] = e.target.value;
        break;
      case "witness":
        if (index === undefined) return;
        changeState.witnesses[index][mode][key] = e.target.value;
        break;
      case "other":
        if (key === undefined) return;
        changeState[key] = e.target.value;
        break;
      default:
        return;
    }
    setFormState({
      ...changeState,
    });
  };

  const onChangeFile = async (e) => {
    const files = e.target.files;
    // const filesKeyArr = Object.keys(files);
    console.log(files);
    var i;
    for (i = 0; i < files["length"]; ++i) {
      console.log(files[i]);
    }

    setFormState({
      ...formState,
      files,
    });
  };
  const setDate = (date) => {
    const newState = formState;
    newState.year_of_marriage = date;
    setFormState({
      ...newState,
    });
  };

  const { bride, groom, year_of_marriage, place, files } = formState;

  // const nonNegative = (number) => {
  //     if(number < 0) return false;
  //     return true;
  // }

  // const isEmpty = (str) => {
  //     if(str.trim() === "") return true;
  //     return false;
  // }

  // const formCheck = () => {
  //   const errors = {
  //     bride: {

  //     },
  //     groom: {

  //     }, 
  //     witness: [],
  //     year_of_marriage: null,
  //     place: null
  //   }

  //   // TODO: Form Checking logic here

  //   setFormState({
  //     ...formState,
  //     errors
  //   })
  // } 

  const setGender = (type, newGender, index) => {
    const newState = formState;
    if(index === undefined){
      newState[type]["public"]["gender"] = newGender
    } else {
      newState["witnesses"][index]["public"]["gender"] = newGender
    }
    setFormState({
      ...newState
    })
  }

  const submitForUpload = async () => {
    const {status, cid, shards} = await processJSONfromFORM(formState);
    // console.log(cid, shards);
    if(status){
      dispatch(addNotification({
        text: "Congratulations you are Registered Successfully. May your bond live forever.",
        type: "success"
      }))
      dispatch(setCid(cid));
      dispatch(setShards(shards));
    } else {
      dispatch(addNotification({
        text: "Some Error Occured while Registering... Try Again Later",
        type: "danger"
      }))
    }
  }

  return (
    <div className="container pt-4 pb-4">
      <h1 className="title mt-4 mb-4">Registration Form</h1>
      <div className="columns">
        <div className="column is-half">
          <div className="field">
            <label className="label">Bride's Name</label>
            <div className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="text"
                placeholder="Bride's Name"
                onChange={(e) => handleChange(e, "bride", "public", "name")}
                value={bride.public.name}
              />
              <span className="icon is-small is-left">
                <i class="far fa-user"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check fa-xs"></i>
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">Bride's Age</label>
            <div className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="number"
                placeholder="Bride's Age"
                onChange={(e) => handleChange(e, "bride", "public", "age")}
                value={bride.public.age}
              />
              <span className="icon is-small is-left">
                <i class="fas fa-level-up-alt"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check fa-xs"></i>
              </span>
            </div>
          </div>
         
          <div className="field">
            <label className="label">Bride's Identification Number</label>
            <div className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="number"
                placeholder="Aadhar Number"
                onChange={(e) =>
                  handleChange(e, "bride", "private", "identification_no")
                }
                value={bride.private.identification_no}
              />
              <span className="icon is-small is-left">
                <i class="fas fa-signature"></i>
              </span>
              <span className="icon is-small is-right">
                <i class="fas fa-signature"></i>
              </span>
            </div>
          </div>
        </div>
        <div className="column is-half">
          <div className="field">
            <label className="label">Groom's Name</label>
            <div className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="text"
                placeholder="Groom's Name"
                onChange={(e) => handleChange(e, "groom", "public", "name")}
                value={groom.public.name}
              />
              <span className="icon is-small is-left">
                <i class="far fa-user"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check fa-xs"></i>
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">Groom's Age</label>
            <div className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="number"
                placeholder="Groom's Age"
                onChange={(e) => handleChange(e, "groom", "public", "age")}
                value={groom.public.age}
              />
              <span className="icon is-small is-left">
                <i class="fas fa-level-up-alt"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check fa-xs"></i>
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">Groom's Identification Number</label>
            <div className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="number"
                placeholder="Groom's Aadhar Number"
                onChange={(e) =>
                  handleChange(e, "groom", "private", "identification_no")
                }
                value={groom.private.identification_no}
              />
              <span className="icon is-small is-left">
                <i class="fas fa-signature"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check fa-xs"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <button className="button is-primary" onClick={() => addWitness()}>
        <strong>Add a witness</strong>
      </button>
      <div className="columns is-flex is-flex-wrap-wrap	">
        {formState.witnesses.map((witness, index) => {
          return (
            <div className="column is-half border" key={index}>
              <div className="field">
                <label className="label">Witness's Name: {index + 1}</label>
                <div className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    type="text"
                    placeholder={`Witness ${index + 1} name`}
                    onChange={(e) =>
                      handleChange(e, "witness", "public", "name", index)
                    }
                    value={witness.public.name}
                  />
                  <span className="icon is-small is-left">
                    <i class="far fa-user"></i>
                  </span>
                  <span className="icon is-small is-right">
                    <i className="fas fa-check fa-xs"></i>
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">Witness's Age: </label>
                <div className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    type="number"
                    placeholder={`Witness ${index + 1} age`}
                    onChange={(e) =>
                      handleChange(e, "witness", "public", "age", index)
                    }
                    value={witness.public.age}
                  />
                  <span className="icon is-small is-left">
                    <i class="fas fa-level-up-alt"></i>
                  </span>
                  <span className="icon is-small is-right">
                    <i className="fas fa-check fa-xs"></i>
                  </span>
                </div>
              </div>
              <Gender 
                activeGender={witness.public.gender} 
                type={"witness"}
                idx={index}
                setGender={setGender}
              />
              <div className="field">
                <label className="label">Witness's Identification Number</label>
                <div className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    type="number"
                    placeholder={`Witness ${index + 1} Addhar Number`}
                    onChange={(e) =>
                      handleChange(
                        e,
                        "witness",
                        "private",
                        "identification_no",
                        index
                      )
                    }
                    value={witness.private.identification_no}
                  />
                  <span className="icon is-small is-left">
                    <i class="fas fa-signature"></i>
                  </span>
                  <span className="icon is-small is-right">
                    <i className="fas fa-check fa-xs"></i>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="field">
        <label className="label">Date of Marriage</label>
        <div className="control has-icons-left has-icons-right">
          <DatePicker
            className="input"
            selected={year_of_marriage}
            onChange={(date) => setDate(date)}
          />
          <span className="icon is-small is-left">
            <i class="fas fa-calendar-day"></i>
          </span>
          <span className="icon is-small is-right">
            <i className="fas fa-check fa-xs"></i>
          </span>
        </div>
      </div>
      <div className="field">
        <label className="label">Place of Getting Married</label>
        <div className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="email"
            placeholder="Place like `Kanpur, Uttar Pradesh, India`"
            onChange={(e) => handleChange(e, "other", null, "place")}
            value={place}
          />
          <span className="icon is-small is-left">
            <i class="fas fa-place-of-worship"></i>
          </span>
          <span className="icon is-small is-right">
            <i className="fas fa-check fa-xs"></i>
          </span>
        </div>
      </div>

      <div className="file has-name mb-5">
        <label className="file-label">
          <input
            className="file-input"
            multiple
            type="file"
            name="file"
            onChange={(e) => onChangeFile(e)}
          />
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-upload"></i>
            </span>
            <span className="file-label">Choose a file…</span>
          </span>
          {files &&
            [...files].map((file) => {
              return (
                <span className="file-name" key={file.name}>
                  {file.name}
                </span>
              );
            })}
        </label>
      </div>

      <button className="button is-primary" onClick={() => submitForUpload()}>Get Registered</button>
    </div>
  );
};

export default RegistrationForm;
