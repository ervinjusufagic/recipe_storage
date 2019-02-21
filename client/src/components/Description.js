import React, { Component } from "react";
import {
  DropdownItem,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
class Description extends Component {
  constructor(props) {
    super(props);

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }
  state = {
    recipe: this.props.location.recipe,
    token: this.props.location.token,
    protein: 0,
    carbs: 0,
    energy: 0,
    dropdownOpen: false,
    oldServing: 2,
    serving: 2
  };

  componentWillMount() {
    this.getNutrients();
  }

  mapIngredients() {
    return this.state.recipe.ingredients.map(ingredient => (
      <li key={ingredient.Nummer} className="list-group-item">
        {ingredient.value} {ingredient.unit} {ingredient.Namn}{" "}
      </li>
    ));
  }
  //^map ingredients to screen
  getNutrients() {
    this.state.recipe.ingredients.forEach(ingredient => {
      ingredient.Naringsvarden.Naringsvarde.forEach(nutrient => {
        if (nutrient.Namn === "Protein") {
          this.state.protein +=
            (parseFloat(ingredient.grams) / 100) * parseFloat(nutrient.Varde);
        }
        if (nutrient.Namn === "Kolhydrater") {
          this.state.carbs +=
            (parseFloat(ingredient.grams) / 100) * parseFloat(nutrient.Varde);
        }
        if (nutrient.Forkortning === "Ener") {
          this.state.energy +=
            (parseFloat(ingredient.grams) / 100) * parseFloat(nutrient.Varde);
        }
      });
    });
    //^calculate the amount off nutrients per portion, easier to do this than setState :p
  }

  toggleDropdown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleOnClickDropdown(servings) {
    this.setState({
      serving: servings
    });
    this.state.recipe.ingredients.map(ingredient => {
      let newIngredientAmount =
        (parseFloat(ingredient.value) * servings) / this.state.oldServing;
      ingredient.value = newIngredientAmount;
    });
  }

  handleOldServing(serving) {
    this.setState({
      oldServing: serving
    });
  }
  //^handles the change and calculations for changing servings on dropdown
  render() {
    return (
      <div>
        <div className="d-flex flex-column">
          <Nav>
            <NavItem>
              <NavLink href="/">Recept & näring</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/">Recept</NavLink>
            </NavItem>
          </Nav>
        </div>

        <div className="d-flex flex-row">
          <div>
            <img src={this.state.recipe.image} alt="image" />
          </div>
          <div>
            <h1>{this.state.recipe.name}</h1>
            <h5>Ingredienser</h5>
            <h6>Portion:</h6>
            <ButtonDropdown
              isOpen={this.state.dropdownOpen}
              toggle={this.toggleDropdown}
            >
              <DropdownToggle
                onClick={() => this.handleOldServing(this.state.serving)}
                size="sm"
                caret
              >
                {this.state.serving}
                {this.state.dropDownTitle}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => this.handleOnClickDropdown(2)}>
                  2
                </DropdownItem>
                <DropdownItem onClick={() => this.handleOnClickDropdown(4)}>
                  4
                </DropdownItem>
                <DropdownItem onClick={() => this.handleOnClickDropdown(6)}>
                  6
                </DropdownItem>
                <DropdownItem onClick={() => this.handleOnClickDropdown(8)}>
                  8
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
            <ul className="list-group">{this.mapIngredients()}</ul>
            <ul className="list-group">
              <li className="list-group-item">
                <h5>Näringvärden per portion</h5>
              </li>
              <li className="list-group-item">
                Protein: {Math.round(this.state.protein * 100) / 100} g
              </li>
              <li className="list-group-item">
                Energi: {Math.round(this.state.energy * 100) / 100} kcal
              </li>
              <li className="list-group-item">
                Kolhydrater: {Math.round(this.state.carbs * 100) / 100} g
              </li>
            </ul>
            <ul className="list-group">
              <li className="list-group-item">
                <h5>Instruktioner</h5>
              </li>
              <li className="list-group-item">
                {this.state.recipe.instructions}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export { Description };
