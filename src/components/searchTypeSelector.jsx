import Select from 'react-dropdown-select';
import Dropdown from "react-bootstrap/Dropdown";

function SearchTypeSelector(props) {
    const searchTypeArray = [
        { label: '--All--', value: '--All--' },
        { label: 'Cards', value: 'Cards' },
        { label: 'Files', value: 'Files' },
    ];

    return (
        <div>
            {/*
            <Select
                style={{ height: 40, borderRadius: "0 10px 10px 0", width: 100, margin: "0 4px", zIndex: 9999 }}
                options={searchTypeArray}
                labelField="label"
                valueField="value"
                values={[
                    { label: props.searchType, value: props.searchType },
                ]}
                onChange={(values) => {
                    console.log(values);
                    props.onSearchTypeChange(values[0].value);
                }}
                placeholder="Search filter"
            />
            */}
            <Dropdown
                onSelect={(value) => {
                    props.onSearchTypeChange(value);
                }}
                style={{ float: "right" }}
            >
                <Dropdown.Toggle
                    variant="secondary"
                    style={{
                        background: "transparent",
                        color: "var(--body-color)",
                        border: "none",
                        boxShadow: "none",
                        margin: 0,
                    }}
                >
                    {props.searchType}
                </Dropdown.Toggle>
                <Dropdown.Menu align="left">
                    <Dropdown.Item eventKey="--All--">--All--</Dropdown.Item>
                    <Dropdown.Item eventKey="Cards">Cards</Dropdown.Item>
                    <Dropdown.Item eventKey="Files">Files</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default SearchTypeSelector;