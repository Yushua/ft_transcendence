import { newWindow } from "../App";
import SearchBar from "../Search bar/SearchBar";

export function ButtonRefresh() {
  newWindow(<SearchBar/>)
}

function SearchButtonComponent() {
    return (
      <button onClick={() => {ButtonRefresh()}}>Search</button>
    )
}

export default SearchButtonComponent;