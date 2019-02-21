import React, { Component } from "react";
import { Container, Row, Button, Nav, NavItem, NavLink } from "reactstrap";
import { Redirect } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);

    this.showDescription = this.showDescription.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    disabled: undefined,
    recipes: [],
    token: this.props.location.token,
    show: false,
    searchValue: ""
  };

  componentWillMount() {
    this.fetchRecipes();
  }

  fetchRecipes() {
    fetch("http://localhost:3000/recipes", {
      method: "GET"
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          recipes: responseJson.recipes
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleChange(event) {
    this.setState({ searchValue: event.target.value });

    if (!event.target.value == 0) {
      this.searchRecipe(event.target.value);
    }
  }

  removeRecipe(id) {
    fetch("http://localhost:3000/recipes/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.fetchRecipes();
      })
      .catch(error => {
        console.error(error);
      });
  }

  renderDeleteButton(id) {
    if (this.state.token !== undefined) {
      return (
        <button
          className="btn btn-danger"
          onClick={() => {
            this.removeRecipe(id);
          }}
        >
          Ta bort recept
        </button>
      );
    }
  }

  showDescription(recipes) {
    if (this.state.show) {
      return (
        <Redirect
          push
          to={{
            pathname: "/description",
            recipe: recipes,
            token: this.state.token
          }}
        />
      );
    }
  }

  searchRecipe(name) {
    fetch("http://localhost:3000/recipes/" + name, {
      method: "GET"
    })
      .then(response => response.json())
      .then(responseJson => {
        if (name.length >= 2) {
          this.setState({
            recipes: responseJson
          });
        } else {
          this.fetchRecipes();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  renderRecipes() {
    return this.state.recipes.map(recipes => (
      <div key={recipes._id} className="card col-4" style={{ width: 300 }}>
        <img
          className="card-img-top"
          src={recipes.image}
          alt="Card image cap"
        />
        <div className="card-body">
          <h5 className="card-title">{recipes.name}</h5>
          <h6 className="card-title">Kategori: {recipes.category}</h6>

          <button
            className="btn btn-primary"
            onClick={() => {
              this.setState({
                show: true,
                selectedRecipe: recipes
              });
            }}
          >
            Visa recept
          </button>
          {this.renderDeleteButton(recipes._id)}
        </div>
      </div>
    ));
  }

  handleCategory(category) {
    fetch("http://localhost:3000/recipes/category/" + category, {
      method: "GET"
    })
      .then(response => response.json())
      .then(responseJson => {
        if (category !== "alla") {
          this.setState({
            recipes: responseJson
          });
        } else {
          this.fetchRecipes();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    if (!this.state.show) {
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
                <NavLink
                  disabled={this.state.token != undefined ? false : true}
                  href="/post"
                >
                  Lägg till recept
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/login">Logga in</NavLink>
              </NavItem>
              <NavItem>
                Sök efter recept:
                <input
                  value={this.state.searchValue}
                  onChange={this.handleChange}
                />
              </NavItem>
            </Nav>
            {this.state.token != undefined ? (
              <div />
            ) : (
              <div>Logga in för att lägga till recept</div>
            )}

            <div className="d-flex flex-row">
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
              <Button
                onClick={() => this.handleCategory("alla")}
                className="btn btn-primary"
              >
                alla
              </Button>
            </div>
            <div className="d-flex flex-row row">{this.renderRecipes()}</div>
          </Row>
        </Container>
      );
    } else {
      return this.showDescription(this.state.selectedRecipe);
    }
  }
}

export { Home };
