import SearchTypeSelector from "./searchTypeSelector";

function SearchBlock(props) {

    const style = {
        background: "var(--inactive-search-background)",
        display: "flex",
        paddingLeft: 0,
        paddingRight: 0,
        alignItems: "center",
        borderRadius: props.desktop ? 12 : 0
    };

    if (props.desktop) {
        style.flexGrow = 1;
    }

    const searchIcon = !props.desktop ? "" : (<span style={{ position: "absolute", left: "13px", top: "11px" }}>
        <svg
            width="24"
            height="24"
            style={{
                opacity: 0.6,
                stroke: "var(--table-pane-color)",
            }}
        >
            <use href="#f-search"></use>
        </svg>
    </span>)

    const inputPadding = !props.desktop ? "0px 30px 0px 10px" : "0px 30px 0px 44px";



    return props.page != "Main" ? "" : (

        <div
            className={props.desktop ? "d-none d-sm-flex" : ""}
            style={style}>
            <div style={{ flexGrow: 1, position: "relative" }}>
                <input
                    className="search_string"
                    type="text"
                    placeholder="Search.."
                    autoComplete="off"
                    onChange={props.onSearchChange}
                    value={props.searchString}
                    style={{
                        backdropFilter: "blur(40px)",
                        padding: inputPadding,
                        border: "none",
                        borderRadius: props.desktop ? "12px 0 0 12px" : 0,
                    }}

                />
                <span
                    className="search_clear"
                    onClick={props.onSearchClear}
                >
                    <svg width="0.7em" height="0.7em" className="item_icon" style={{ fill: "var(--table-pane-color)" }}>
                        <use href="#cross"></use>
                    </svg>
                </span>
                {searchIcon}

            </div>
            <SearchTypeSelector
                searchType={props.searchType}
                onSearchTypeChange={props.onSearchTypeChange}
            />

        </div>)
}

export default SearchBlock;