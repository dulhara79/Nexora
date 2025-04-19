<<<<<<<< HEAD:server/src/main/java/com/nexora/server/repository/forum/NotificationRepository.java
package com.nexora.server.repository.forum;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.nexora.server.model.forum.Notification;

import java.util.List;

========
package com.nexora.server.repository.post;

import com.nexora.server.model.post.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

>>>>>>>> origin/main:server/src/main/java/com/nexora/server/repository/post/NotificationRepository.java
@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
}