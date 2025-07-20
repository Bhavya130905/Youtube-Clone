import { useState } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";

const SearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState('');

  return (
    <InputGroup className="mb-3">
      <Form.Control
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSearch(search);
          }
        }}
      />
      <Button
        variant="danger"
        onClick={() => onSearch(search)}
      >
        Search...
      </Button>
    </InputGroup>
  );
};

export default SearchBar