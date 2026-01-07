// task-app-backend/src/tasks/entities/task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SubTask } from '../../subtasks/entities/subtask.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User, (user) => user.createdTasks)
  creator: User;

  @Column()
  creatorId: string;

  @ManyToMany(() => User, (user) => user.assignedTasks)
  @JoinTable({
    name: 'task_assigned_users',
    joinColumn: {
      name: 'task_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  assignedUsers: User[];

  @Column({
    type: 'enum',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
    default: 'PENDING'
  })
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

  @OneToMany(() => SubTask, (subtask) => subtask.task, { cascade: true })
  subtasks: SubTask[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}