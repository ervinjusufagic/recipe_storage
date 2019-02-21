import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Row,
  DropdownItem,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  Button,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

class PostRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      ingredients: [],
      value: "",
      unitValue: "",
      gramValue: "",
      searchResult: [],
      dropdownOpen: false,
      dropDownTitle: "Enhet",
      disableSearch: false,
      count: 0,
      selectedIngredient: [],
      category: "",
      pickedIngredients: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUnit = this.handleUnit.bind(this);
    this.handleGram = this.handleGram.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });

    if (!event.target.value == 0) {
      this.searchIngredient(event.target.value);
    }
  }

  handleUnit(event) {
    this.setState({ unitValue: event.target.value });
  }

  handleGram(event) {
    this.setState({ gramValue: event.target.value });
  } //^handles input

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    fetch("http://localhost:3000/recipes/", {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message === "Created recipe") {
          this.addToRecipe(responseJson.createdRecipe._id);
          this.setState({
            redirect: true
          });
        } else {
          this.setState({
            redirect: false
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  addToRecipe(id) {
    fetch("http://localhost:3000/recipes/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ingredients: this.state.ingredients
      })
    })
      .then(response => response.json())
      .then(responseJson => {})
      .catch(error => {
        console.error(error);
      });
  } //^push to db
  searchIngredient(word) {
    fetch("http://localhost:3000/ingredients/" + word, {
      method: "GET"
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          searchResult: responseJson.result
        });
      })
      .catch(error => {
        console.error(error);
      });
  } //^search for ingredient

  mapResults() {
    if (this.state.searchResult != undefined) {
      return this.state.searchResult.map(results => (
        <div key={results.Nummer} className="list-group">
          <button
            type="button"
            className="list-group-item list-group-item-action"
            onClick={() => {
              this.setState({
                selectedIngredient: [results],
                ingredients: [...this.state.ingredients, results],
                searchResult: undefined,
                value: "",
                disableSearch: true
              });
            }}
          >
            {results.Namn}
          </button>
        </div>
      ));
    }
  } //^display all the results from search then save clicked one
  toggleDropdown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleOnClickDropdown(value) {
    this.setState({
      dropDownTitle: value
    });
  } //^handles dropdowns for input

  handleIngredient() {
    this.state.ingredients[this.state.count] = {
      ...this.state.ingredients[this.state.count],
      value: this.state.unitValue,
      unit: this.state.dropDownTitle,
      grams: this.state.gramValue
    };

    this.setState({
      disableSearch: false,
      count: (this.state.count += 1),
      value: "",
      unitValue: "",
      gramValue: "",
      dropDownTitle: "Enhet",
      pickedIngredients: [
        ...this.state.selectedIngredient,
        ...this.state.pickedIngredients
      ],
      selectedIngredient: []
    });
  }
  //^puches input values to object in array (this.setstate acts weird here)
  mapSelectedIngredients() {
    return this.state.selectedIngredient.map(ingredient => (
      <li
        key={ingredient.Nummer}
        className="list-group-item d-flex flex-row justify-content-between"
      >
        {ingredient.Namn}

        <div>
          Ange hur mycket:{" "}
          <input
            style={{ width: 50 }}
            value={this.state.unitValue}
            onChange={this.handleUnit}
          />
          <ButtonDropdown
            isOpen={this.state.dropdownOpen}
            toggle={this.toggleDropdown}
          >
            <DropdownToggle size="sm" caret>
              {this.state.dropDownTitle}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => this.handleOnClickDropdown("st")}>
                st
              </DropdownItem>
              <DropdownItem onClick={() => this.handleOnClickDropdown("kg")}>
                Kg
              </DropdownItem>
              <DropdownItem onClick={() => this.handleOnClickDropdown("g")}>
                gram
              </DropdownItem>
              <DropdownItem onClick={() => this.handleOnClickDropdown("msk")}>
                msk
              </DropdownItem>
              <DropdownItem onClick={() => this.handleOnClickDropdown("tsk")}>
                tsk
              </DropdownItem>
              <DropdownItem onClick={() => this.handleOnClickDropdown("liter")}>
                liter
              </DropdownItem>
              <DropdownItem onClick={() => this.handleOnClickDropdown("dl")}>
                dl
              </DropdownItem>
              <DropdownItem onClick={() => this.handleOnClickDropdown("cl")}>
                cl
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <div>
          Ange hur mycket i gram:{" "}
          <input
            value={this.state.gramValue}
            onChange={this.handleGram}
            style={{ width: 50 }}
          />
          <Button
            onClick={() => this.handleIngredient()}
            className="btn btn-success btn-sm"
          >
            Lägg till
          </Button>
        </div>
      </li>
    ));
  }
  //^this only maps the one ingredient you clicked, didnt have time to fix a view where u can see all the ingredient u selected

  mapPicked() {
    return this.state.pickedIngredients.map(ingredient => (
      <li key={ingredient.Nummer}> {ingredient.Namn}</li>
    ));
  }
  handleCategory(category) {
    this.setState({
      category: category
    });
  }

  render() {
    if (!this.state.redirect) {
      return (
        <Container>
          <Row className="d-flex flex-column">
            <Nav>
              <NavItem>
                <NavLink href="/">Recept & näring</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/">Recept</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/post">Lägg till recept</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/login">Logga in</NavLink>
              </NavItem>
            </Nav>
            <form onSubmit={this.handleSubmit}>
              <div className="formgroup d-flex flex-column">
                <h5 style={{ color: "red" }}>
                  Ange information för 2 portioner
                </h5>
                <label>Receptnamn</label>
                <input
                  required
                  className="form-control"
                  name="name"
                  type="text"
                />
              </div>

              <div className="formgroup d-flex flex-column">
                <label>Kategori</label>
                <Button
                  onClick={() => this.handleCategory("frukost")}
                  className="btn btn-primary"
                >
                  frukost
                </Button>{" "}
                <Button
                  onClick={() => this.handleCategory("lunch")}
                  className="btn btn-primary"
                >
                  lunch
                </Button>{" "}
                <Button
                  onClick={() => this.handleCategory("kvällsmat")}
                  className="btn btn-primary"
                >
                  kvällsmat
                </Button>
                <input
                  disabled={false}
                  readOnly
                  className="form-control"
                  required
                  name="category"
                  type="text"
                  value={this.state.category}
                />
              </div>

              <div className="formgroup d-flex flex-column">
                <label>Sök efter ingrediens</label>
                <input
                  disabled={this.state.disableSearch}
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                  className="form-control"
                />
                {this.mapResults()}
                {this.mapSelectedIngredients()}
                {this.mapPicked()}
              </div>

              <div className="formgroup d-flex flex-column">
                <label>Receptinstruktioner:</label>
                <textarea
                  required
                  className="form-control"
                  name="instructions"
                  type="text"
                  rows="8"
                />
              </div>

              <div className="formgroup d-flex flex-row">
                <label>Lägg till en bild </label>
                <input
                  required
                  className="form-control-file"
                  name="image"
                  type="file"
                />
                <button className="btn btn-primary">Lägg till</button>
              </div>
            </form>
          </Row>
          <Row />
        </Container>
      );
    } else {
      return <Redirect to={{ pathname: "/", token: this.state.token }} />;
    }
  }
}

export { PostRecipe };
