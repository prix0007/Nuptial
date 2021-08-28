import React from "react";

const Gender = ({activeGender, type, idx, setGender}) => {
  const genders = ["male", "female"];
  const [open, setOpen] = React.useState(false);

  return (
    <div class="dropdown is-active mb-3">
      <div class="dropdown-trigger">
        <button
          class="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => {setOpen(!open)}}
        >
          <span>{activeGender.trim() !== "" ? activeGender.toLocaleUpperCase() : "Select Gender"}</span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      {open && <div class="dropdown-menu" id="dropdown-menu" role="menu" onClick={() => {setOpen(!open)}}>
        <div class="dropdown-content">
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
