// task-app-backend/src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Notification } from '../../notifications/entities/notification.entity'; // Ensure this file exists or adjust the path
import { SubTask } from '../../subtasks/entities/subtask.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'USER'],
    default: 'USER'
  })
  role: 'ADMIN' | 'USER';

  // Tasks created by this user
  @OneToMany(() => Task, (task) => task.creator)
  createdTasks: Task[];

  // Tasks assigned to this user
  @ManyToMany(() => Task, (task) => task.assignedUsers)
  assignedTasks: Task[];

  // Subtasks assigned to this user
  @OneToMany(() => SubTask, (subtask) => subtask.assignedUser)
  assignedSubTasks: SubTask[];

  // Notifications for this user
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}