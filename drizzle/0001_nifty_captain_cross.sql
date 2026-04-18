CREATE TABLE `admin_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`targetUserId` int,
	`targetInvestmentId` int,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investment_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`expectedYield` varchar(50) NOT NULL,
	`riskLevel` enum('low','medium','high') NOT NULL,
	`displayOrder` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `investment_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investment_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`minAmount` decimal(15,2) NOT NULL,
	`maxAmount` decimal(15,2),
	`roi` decimal(5,2) NOT NULL,
	`duration` int NOT NULL,
	`description` text,
	`features` text,
	`displayOrder` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `investment_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_investments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`planId` int NOT NULL,
	`categoryId` int NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`expectedReturn` decimal(15,2) NOT NULL,
	`status` enum('pending','active','completed','withdrawn') NOT NULL DEFAULT 'pending',
	`stripePaymentId` varchar(255),
	`startDate` timestamp,
	`endDate` timestamp,
	`actualReturn` decimal(15,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_investments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `withdrawal_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`status` enum('pending','approved','rejected','completed') NOT NULL DEFAULT 'pending',
	`reason` text,
	`approvedBy` int,
	`approvalDate` timestamp,
	`rejectionReason` text,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `withdrawal_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `totalInvested` decimal(15,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalEarnings` decimal(15,2) DEFAULT '0' NOT NULL;