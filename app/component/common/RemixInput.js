function RemixInput({ errors, id, name, type, value }) {
  return type === 'dropdown' ?
    <div className="form-control">
      <label htmlFor={id}>Gender:</label>
      <select id={id} name={name}>
        {value.map((v, index) => <option value={v} key={index} hidden={!v}>{v ? v.toUpperCase() : "Select"}</option>)}
      </select>
      {errors?.gender ? <em className="text-red-600">{errors.gender}</em> : null}
    </div> :
    <div className="form-control">
      <label htmlFor={id}>{name}:</label>
      <input type={type} name={name} id={id} />
      {errors ? <em className="text-red-600">{errors}</em> : null}
    </div>


}

export default RemixInput;
