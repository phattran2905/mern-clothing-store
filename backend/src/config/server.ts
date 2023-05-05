export const ENV_VARIABLES = {
	PORT: process.env.PORT ?? 2905,
	DATABASE_URL:
		process.env.DATABASE_URL ?? "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA",
	JWT_SECRET: process.env.JWT_SECRET ?? "WywaBLM_tURsRGjBsSg-dOtFStP4-Mw5ki1kNcLkdiI",
	EMAIL_USER: process.env.EMAIL_USER ?? "EMAIL_USER",
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ?? "EMAIL_PASSWORD",
}
