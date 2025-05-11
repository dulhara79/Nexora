package com.nexora.server.controller.learningplan;

import com.nexora.server.model.learningplan.UserPlan;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class UserPlanModelAssembler
    implements RepresentationModelAssembler<UserPlan, EntityModel<UserPlan>> {

  @Override
  public @NonNull EntityModel<UserPlan> toModel(@NonNull UserPlan plan) {
    return EntityModel.of(plan,
      linkTo(methodOn(UserPlanController.class)
        .getPlans(plan.getUserId()))
        .withSelfRel());
  }
}
