package com.nexora.server.controller.learningplan;

import com.nexora.server.model.learningplan.Cuisine;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class CuisineModelAssembler
    implements RepresentationModelAssembler<Cuisine, EntityModel<Cuisine>> {

  @Override
  public @NonNull EntityModel<Cuisine> toModel(@NonNull Cuisine cuisine) {
    return EntityModel.of(cuisine,
      linkTo(methodOn(CuisineController.class)
        .getCuisineByName(cuisine.getName()))
        .withSelfRel(),
      linkTo(methodOn(CuisineController.class)
        .getCuisinesByLevel(cuisine.getLevel()))
        .withRel("cuisines"));
  }
}

