# supabase-to-typescript
Automatically generate typescript models for tables in your Supabase Postgresql database

This is a very simple node.js script that'll go out to your Supabase endpoint, grab some funky json, throw it in a blender, and output a set of table models for you to use in your Typescript project.

Here's some example output:
```
export interface Tables {
	todos: {
		id: number; /* format: bigint description: Note: This is a Primary Key.<pk/>*/
		user_id: string; /* format: uuid description: Note: This is a Foreign Key to `users.id`.<fk table='users' column='id'/>*/
		task?: string; /* format: text */
		is_complete?: boolean; /* format: boolean */
		inserted_at: string /* UNKNOWN FORMAT */; /* format: timestamp with time zone */
	}
	users: {
		id: string; /* format: uuid description: Note: This is a Primary Key.<pk/> This is a Foreign Key to `users.id`.<fk table='users' column='id'/>*/
		displayname?: string; /* format: text */
		bio?: string; /* format: text */
		email?: string; /* format: text */
    		jsonfield: any; /* format: jsonb */
	}
}
```

This is just a rough first pass, and it's pretty simple code that you can modify if you want to customize the Typescript types that get generated.

# prerequisites:
1. nodejs installed on the command line (node --version better work for you!)
2. you'll need to know your Supabase URL and Supabase key (the anon or public key)
3. you'll need to make one of the smallest decisions of your life:  what do you want to call your output file

# syntax:
```
node supabase-to-typescript.js <outputFilename> <Supabase-url> <Supabase-public-api-key>
```
# example:
```
node supabase-to-typescript.js models/Tables.ts xxxxxxxxxxxxxxxxxxxx.supabase.co heyThisisMyReallyLongPublicKeyThatIGotBySigningIntoSupabase.ioAndIJustPastedItHereBecauseItWouldTakeLongerToTypeItThanItWouldBeToCodeMyEntireAppInX86AssemblerWith12MonkeysOnOriginalIBMKeyboards
```
