import React from "react";

const Gender = ({activeGender, type, idx, setGender}) => {
  const genders = ["male", "female"];
  const [open, setOpen] = React.useState(false);

  return (
    <div className="dropdown is-active mb-3">
      <div className="dropdown-trigger">
        <button
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => {setOpen(!open)}}
        >
          <span>{activeGender.trim() !== "" ? activeGender.toLocaleUpperCase() : "Select Gender"}</span>
          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      {open && <div className="dropdown-menu" id="dropdown-menu" role="menu" onClick={() => {setOpen(!open)}}>
        <div className="dropdown-content">
          {genders.map((gender, index) => {
            return (
              <div
                key={index+type}
                className={`dropdown-item ${
                  gender === activeGender && "is-active"
                }`}
                onClick={() => setGender(type, gender, idx)}
              >
                {gender.toLocaleUpperCase()}
              </div>
            );
          })}
        </div>
      </div>}
    </div>
  );
};

export default Gender;
