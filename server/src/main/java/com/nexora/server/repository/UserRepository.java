package com.nexora.server.repository;

import com.nexora.server.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    
    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'username': { $regex: ?0, $options: 'i' } } ] }")
    List<User> findByNameOrUsername(String query);
}