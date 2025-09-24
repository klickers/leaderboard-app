import { defineDb, column, defineTable, sql } from "astro:db"

const uuidGenerator =
	() => sql`lower(hex( randomblob(4)) || '-' || hex( randomblob(2))
            || '-' || '4' || substr( hex( randomblob(2)), 2) || '-'
            || substr('AB89', 1 + (abs(random()) % 4) , 1)  ||
            substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)))`

const User = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		name: column.text(),
		email: column.text({ unique: true }),
		emailVerified: column.boolean({ default: false }),
		image: column.text({ optional: true }),
		createdAt: column.date({ default: new Date() }),
		updatedAt: column.date({ default: new Date() }),
	},
})

const Session = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		userId: column.text({ references: () => User.columns.id }),
		token: column.text(),
		expiresAt: column.date(),
		ipAddress: column.text({ optional: true }),
		userAgent: column.text({ optional: true }),
		createdAt: column.date({ default: new Date() }),
		updatedAt: column.date({ default: new Date() }),
	},
})

const Account = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		userId: column.text({ references: () => User.columns.id }),
		accountId: column.text(),
		providerId: column.text(),
		accessToken: column.text({ optional: true }),
		refreshToken: column.text({ optional: true }),
		accessTokenExpiresAt: column.date({ optional: true }),
		refreshTokenExpiresAt: column.date({ optional: true }),
		scope: column.text({ optional: true }),
		idToken: column.text({ optional: true }),
		password: column.text({ optional: true }),
		createdAt: column.date({ default: new Date() }),
		updatedAt: column.date({ default: new Date() }),
	},
})

const Verification = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		identifier: column.text(),
		value: column.text(),
		expiresAt: column.date(),
		createdAt: column.date({ default: new Date() }),
		updatedAt: column.date({ default: new Date() }),
	},
})

const Board = defineTable({
	columns: {
		id: column.text({ primaryKey: true, default: uuidGenerator() }),
		creatorId: column.text({
			references: () => User.columns.id,
		}),
		categoryId: column.text({
			references: () => Category.columns.id,
			optional: true,
		}),
		name: column.text(),
		description: column.text({ optional: true }),
		counterValue: column.number({ default: 0 }),
		counterText: column.text({ default: "" }),
		startDate: column.date({ optional: true }),
		endDate: column.date(),
		isPublic: column.boolean({ default: false }),
	},
	indexes: [{ on: ["id", "categoryId"], unique: true }],
})

const Category = defineTable({
	columns: {
		id: column.text({ primaryKey: true, default: uuidGenerator() }),
		creatorId: column.text({
			references: () => User.columns.id,
		}),
		name: column.text(),
	},
})

export default defineDb({
	tables: {
		User,
		Session,
		Account,
		Verification,
		Board,
		Category,
	},
})
