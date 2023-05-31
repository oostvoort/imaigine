# imaigine

note about pnpm: the mud template provided by the lattice team uses pnpm and it's the only way of using the template,
refactoring to use yarn can work but may take some time, don't fix what ain't broke I guess

setup

`pnpm recursive initialize`

running

`pnpm dev:contracts` then `pnpm dev:client` then  `pnpm dev:server`

or you know, just click on the run button next to the script in the package.json to let webstorm handle it

if you get `Error: Command failed with ENOENT: forge cleans` or any similar error when trying to run contract
scripts using webstorm the fix for this is copying your terminal $PATH and overriding the webstorm run configuration.
best to update the template so you won't have to do it everytime

![img.png](assets/img.png)

![img_1.png](assets/img_1.png)

Open terminal and run `$PATH` then copy it (minus bash and the error at the end)
![img_2.png](assets/img_2.png)

Override this variable
![img_3.png](assets/img_3.png)

Should now affect all npm configurations in the project
![img_4.png](assets/img_4.png)

# Issues Encountered
There seems to be a problem with the newest version of anvil. The following is the fix:
````shell
foundryup -C f3c20d5
````
