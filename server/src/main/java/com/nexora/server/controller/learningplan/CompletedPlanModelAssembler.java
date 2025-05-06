package com.nexora.server.controller.learningplan;

import com.nexora.server.model.learningplan.CompletedPlan;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class CompletedPlanModelAssembler
    implements RepresentationModelAssembler<CompletedPlan, EntityModel<CompletedPlan>> {

  @Override
  public @NonNull EntityModel<CompletedPlan> toModel(@NonNull CompletedPlan plan) {
    return EntityModel.of(plan,
      // self link to this collection
      linkTo(methodOn(CompletedPlanController.class)
        .getCompletedPlans(plan.getUserId()))
        .withSelfRel());
  }
}
