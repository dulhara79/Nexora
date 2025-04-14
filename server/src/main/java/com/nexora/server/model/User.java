package com.nexora.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
  @Id
  private String id;

  @NotBlank(message = "Email is required")
  @Email(message = "Invalid email format")
  private String email;

  @Size(min = 6, message = "Password must be at least 6 characters")
  private String password;

  @NotBlank(message = "Name is required")
  @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
  private String name;

  @NotBlank(message = "Username is required")
  @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
  private String username;

  private String about;
  private String profilePhotoUrl;
  private String bannerPhotoUrl;
  private String likeSkill;

  private boolean emailVerified = false;
  private String verificationCode;
  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime lastLogin;

  private List<String> followers = new ArrayList<>();
  private List<String> following = new ArrayList<>();
  private List<SocialMediaLink> socialMedia = new ArrayList<>(); // Updated reference
  private List<String> bookmarkedPosts = new ArrayList<>();

  private Role role;

  public User() {
  }

  public User(String id, String email, String password, String name, String username, String about,
      String profilePhotoUrl,
      String bannerPhotoUrl, String likeSkill, boolean emailVerified, String verificationCode,
      LocalDateTime createdAt, LocalDateTime lastLogin, List<String> followers, List<String> following,
      List<SocialMediaLink> socialMedia, List<String> bookmarkedPosts, Role role) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.username = username;
    this.about = about;
    this.profilePhotoUrl = profilePhotoUrl;
    this.bannerPhotoUrl = bannerPhotoUrl;
    this.likeSkill = likeSkill;
    this.emailVerified = emailVerified;
    this.verificationCode = verificationCode;
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;
    this.followers = followers;
    this.following = following;
    this.socialMedia = socialMedia;
    this.bookmarkedPosts = bookmarkedPosts;
    this.role = role;
  }

  // Getters and Setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getAbout() {
    return about;
  }

  public void setAbout(String about) {
    this.about = about;
  }

  public String getProfilePhotoUrl() {
    return profilePhotoUrl;
  }

  public void setProfilePhotoUrl(String profilePhotoUrl) {
    this.profilePhotoUrl = profilePhotoUrl;
  }

  public String getBannerPhotoUrl() {
    return bannerPhotoUrl;
  }

  public void setBannerPhotoUrl(String bannerPhotoUrl) {
    this.bannerPhotoUrl = bannerPhotoUrl;
  }

  public String getLikeSkill() {
    return likeSkill;
  }

  public void setLikeSkill(String likeSkill) {
    this.likeSkill = likeSkill;
  }

  public boolean isEmailVerified() {
    return emailVerified;
  }

  public void setEmailVerified(boolean emailVerified) {
    this.emailVerified = emailVerified;
  }

  public String getVerificationCode() {
    return verificationCode;
  }

  public void setVerificationCode(String verificationCode) {
    this.verificationCode = verificationCode;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getLastLogin() {
    return lastLogin;
  }

  public void setLastLogin(LocalDateTime lastLogin) {
    this.lastLogin = lastLogin;
  }

  public List<String> getFollowers() {
    return followers;
  }

  public void setFollowers(List<String> followers) {
    this.followers = followers;
  }

  public List<String> getFollowing() {
    return following;
  }

  public void setFollowing(List<String> following) {
    this.following = following;
  }

  public List<SocialMediaLink> getSocialMedia() {
    return socialMedia;
  }

  public void setSocialMedia(List<SocialMediaLink> socialMedia) {
    this.socialMedia = socialMedia;
  }

  public List<String> getBookmarkedPosts() {
    return bookmarkedPosts;
  }

  public void setBookmarkedPosts(List<String> bookmarkedPosts) {
    this.bookmarkedPosts = bookmarkedPosts;
  }

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }
}
