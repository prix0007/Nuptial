import React from "react";

import { saveAs } from "file-saver";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Gender from "./Gender";

import certificateService from "../solana/certificate";

import { addNotification, setShards, setCid } from "../actions";
import { useDispatch } from "react-redux";

import { Redirect } from "react-router-dom";

import { processJSONfromFORM } from "../helpers";

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
  errors: {
    bride: {
      public: {
        name: "",
        age: "",
        gender: "",
      },
      private: {
        identification_no: "",
      },
    },
    groom: {
      public: {
        name: "",
        age: "",
        gender: "",
      },
      private: {
        identification_no: "",
      },
    },
    witnesses: [
      {
        public: {
          name: "",
          age: "",
          gender: "",
        },
        private: {
          identification_no: "",
        },
      },
    ],
    year_of_marriage: "",
    place: "",
  },
};

const RegistrationForm = ({ connection, wallet, certificateAddr }) => {
  const dispatch = useDispatch();
  const [formState, setFormState] = React.useState({ ...INIT });

  const [registered, setRegistered] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const addWitness = () => {
    setFormState({
      ...formState,
      witnesses: [
        ...formState.witnesses,
        {
          public: {
            name: "",
            age: "",
            gender: "",
          },
          private: {
            identification_no: "",
          },
        },
      ],
      errors: {
        ...formState.errors,
        witnesses: [
          ...formState.errors.witnesses,
          {
            public: {
              name: "",
              age: "",
              gender: "",
            },
            private: {
              identification_no: "",
            },
          },
        ],
      },
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

  const { bride, groom, year_of_marriage, place, files, witnesses, errors } =
    formState;

  const nonNegative = (number) => {
    if (number < 0) return false;
    return true;
  };

  const isEmpty = (str) => {
    if (str.trim() === "") return true;
    return false;
  };

  const personCheck = (person) => {
    const errPerson = {
      public: {
        name: "",
        age: "",
        gender: "",
      },
      private: {
        identification_no: "",
      },
    };

    Object.keys(person.public).forEach((key) => {
      if (isEmpty(person.public[key])) {
        errPerson.public[key] = "Field can't be Empty";
      } else {
        errPerson.public[key] = "";
      }
      if (key === "age") {
        if (!nonNegative(parseInt(person.public[key])))
          errPerson.public[key] = "Age can't be Negative";
      }
    });

    Object.keys(person.private).forEach((key) => {
      if (isEmpty(person.private[key])) {
        errPerson.private[key] = "Identification can't be Empty";
      } else {
        errPerson.private[key] = "";
      }
    });

    // console.log(errPerson)

    return errPerson;
  };

  const checkFormNotification = () => {
    dispatch(
      addNotification({
        text: "Check form and fill it Properly to Proceed.",
        type: "danger",
      })
    );
  };

  // const checkPersonResponse = (person) => {
  //   console.log(person)
  //   Object.keys(person.public).forEach((key) => {
  //     if(!isEmpty(person.public[key])){
  //       console.log("Inside")
  //       return false;
  //     }
  //     if(key === "age") {
  //       if(!nonNegative(parseInt(person.public[key])))
  //         return false;
  //     }
  //   })

  //   Object.keys(person.private).forEach((key) => {
  //     if(isEmpty(person.private[key])){
  //       return false
  //     }
  //   })

  //   return true

  // }

  const formCheck = () => {
    const errors = {
      bride: {
        public: {
          name: "",
          age: "",
          gender: "",
        },
        private: {
          identification_no: "",
        },
      },
      groom: {
        public: {
          name: "",
          age: "",
          gender: "",
        },
        private: {
          identification_no: "",
        },
      },
      witnesses: [
        {
          public: {
            name: "",
            age: "",
            gender: "",
          },
          private: {
            identification_no: "",
          },
        },
      ],
      year_of_marriage: "",
      place: "",
    };

    // TODO: Form Checking logic here

    errors.bride = personCheck(bride);
    errors.groom = personCheck(groom);
    errors.witnesses = witnesses.map((witness) => personCheck(witness));

    setFormState({
      ...formState,
      errors,
    });

    if (isEmpty(year_of_marriage.toString())) {
      checkFormNotification();
      return false;
    }
    if (isEmpty(place)) {
      checkFormNotification();
      return false;
    }

    return true;
  };

  const saveFileData = (cid, shards, certificateAddr, walletAddr) => {
    const saveObj = {};
    saveObj["bride"] = bride.public.name;
    saveObj["groom"] = groom.public.name;
    saveObj["secret_bride"] = shards[1];
    saveObj["secret_groom"] = shards[2];
    saveObj["public_key_wallet"] = walletAddr;
    saveObj["storage_account"] = certificateAddr;
    saveObj["cid"] = cid;

    var blob = new Blob([JSON.stringify(saveObj)], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, shards[0] + ".txt");
  };

  const setGender = (type, newGender, index) => {
    const newState = formState;
    if (index === undefined) {
      newState[type]["public"]["gender"] = newGender;
    } else {
      newState["witnesses"][index]["public"]["gender"] = newGender;
    }
    setFormState({
      ...newState,
    });
  };

  const submitForUpload = async () => {
    setLoading(true);
    if (!formCheck()) {
      setLoading(false);
      return;
    }

    if (wallet === null) {
      dispatch(
        addNotification({
          text: "Connect to your wallet first.",
          type: "danger",
        })
      );
      setLoading(false)
      return;
    }

    if (connection.current === undefined || connection.current === null) {
      dispatch(
        addNotification({
          text: "Connect not established. Try Again Connecting your wallet 🔃🔃",
          type: "danger",
        })
      );
    }

    if (certificateAddr === "" || certificateAddr === undefined) {
      dispatch(
        addNotification({
          text: "Certificate address is not yet generated. Make sure to approve transaction. 🔔🔔",
          type: "danger",
        })
      );
    }

    console.log(certificateAddr, wallet, connection.current);

    const { status, cid, shards } = await processJSONfromFORM(formState);
    console.log(cid, shards);

    if (status) {
      dispatch(
        addNotification({
          text: "Posting Transaction to Blockchain. Approve the transaction if it asks.",
          type: "info",
        })
      );
      const res = await certificateService.sendCertificate(
        connection.current,
        wallet,
        certificateAddr,
        cid,
        bride.public.name,
        groom.public.name,
        shards[0]
      );

      console.log(res);
      dispatch(
        addNotification({
          text: "Congratulations you are Registered Successfully. May your bond live forever.",
          type: "success",
        })
      );

      saveFileData(cid, shards, certificateAddr, wallet.publicKey.toBase58());

      dispatch(setCid(cid));
      dispatch(setShards(shards));
      setRegistered(true);
    } else {
      dispatch(
        addNotification({
          text: "Some Error Occured while Registering... Try Again Later",
          type: "danger",
        })
      );
    }
    setLoading(false);
  };

  return (
    <div className="container p-4">
      {registered && <Redirect to="/" />}
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
                <i className="far fa-user"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check fa-xs"></i>
              </span>
            </div>
            {!isEmpty(errors.bride.public.name) && (
              <label className="has-text-danger">
                {errors.bride.public.name}
              </label>
            )}
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
                <i className="fas fa-level-up-alt"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check fa-xs"></i>
              </span>
            </div>
            {!isEmpty(errors.bride.public.age) && (
              <label className="has-text-danger">
                {errors.bride.public.age}
              </label>
            )}
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
                <i className="fas fa-signature"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-signature"></i>
              </span>
            </div>
            {!isEmpty(errors.bride.private.identification_no) && (
              <label className="has-text-danger">
                {errors.bride.private.identification_no}
              </label>
            )}
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
                <i className="far fa-user"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check fa-xs"></i>
              </span>
            </div>
            {!isEmpty(errors.groom.public.name) && (
              <label className="has-text-danger">
                {errors.groom.public.name}
              </label>
            )}
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
                <i className="fas fa-level-up-alt"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check fa-xs"></i>
              </span>
            </div>
            {!isEmpty(errors.groom.public.age) && (
              <label className="has-text-danger">
                {errors.groom.public.age}
              </label>
            )}
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
                <i className="fas fa-signature"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check fa-xs"></i>
              </span>
            </div>
            {!isEmpty(errors.groom.private.identification_no) && (
              <label className="has-text-danger">
                {errors.groom.private.identification_no}
              </label>
            )}
          </div>
        </div>
      </div>
      <button className="button is-primary" onClick={() => addWitness()}>
        <strong>Add a witness</strong>
      </button>
      <div className="columns is-flex is-flex-wrap-wrap	">
        {witnesses.map((witness, index) => {
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
                    <i className="far fa-user"></i>
                  </span>
                  <span className="icon is-small is-right">
                    <i className="fas fa-check fa-xs"></i>
                  </span>
                </div>

                {!isEmpty(errors.witnesses[index].public.name) && (
                  <label className="has-text-danger">
                    {errors.witnesses[index].public.name}
                  </label>
                )}
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
                    <i className="fas fa-level-up-alt"></i>
                  </span>
                  <span className="icon is-small is-right">
                    <i className="fas fa-check fa-xs"></i>
                  </span>
                </div>
                {!isEmpty(errors.witnesses[index].public.age) && (
                  <label className="has-text-danger">
                    {errors.witnesses[index].public.age}
                  </label>
                )}
              </div>
              <Gender
                activeGender={witness.public.gender}
                type={"witness"}
                idx={index}
                setGender={setGender}
              />
              {!isEmpty(errors.witnesses[index].public.gender) && (
                <label className="has-text-danger">
                  {errors.witnesses[index].public.gender}
                </label>
              )}
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
                    <i className="fas fa-signature"></i>
                  </span>
                  <span className="icon is-small is-right">
                    <i className="fas fa-check fa-xs"></i>
                  </span>
                </div>
                {!isEmpty(
                  errors.witnesses[index].private.identification_no
                ) && (
                  <label className="has-text-danger">
                    {errors.witnesses[index].private.identification_no}
                  </label>
                )}
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
            <i className="fas fa-calendar-day"></i>
          </span>
          <span className="icon is-small is-right">
            <i className="fas fa-check fa-xs"></i>
          </span>
        </div>
        {isEmpty(year_of_marriage.toString()) && (
          <label className="has-text-danger">Enter Date of Marraige</label>
        )}
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
            <i className="fas fa-place-of-worship"></i>
          </span>
          <span className="icon is-small is-right">
            <i className="fas fa-check fa-xs"></i>
          </span>
        </div>
        {isEmpty(place) && (
          <label className="has-text-danger">Enter place of Marraige</label>
        )}
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
        <span className="tag has-text-info">Optional</span>
      </div>
      {certificateAddr && (
        <p className="is-size-6 mb-3 breakWord">
          Current Certificate Address: {certificateAddr}
        </p>
      )}
      {loading ? (
        <progress className="progress is-medium is-dark" max="100">
          45%
        </progress>
      ) : (
        <button className="button is-primary" onClick={() => submitForUpload()}>
          Get Registered
        </button>
      )}
    </div>
  );
};

export default RegistrationForm;
