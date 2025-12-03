# SirenX

This project is responsible for receiving carcols.meta files and editing their Sirens section.

## Business Rules

When importing a file, the system should:
* Read the carcols.meta file (XML file)
* Identify the `<Sirens>` section
* Show the list of Sirens for the user to choose which one to edit, if there is more than one
* Allow the user to modify:
  * Name
  * ID
  * sirens (a list of sirens that determines how the light behaves in the game)
	* Each siren in the list must have:
		* BPM
		* Pattern
		* Color
		* Intensity
		* Direction (delta)
* If the user adds or removes sirens (editor columns), the system should adjust the XML structure accordingly
* Save the changes back to the carcols.meta file, maintaining the original XML structure

## File Attributes

Some file attributes are documented here: https://docs.dwnstr.com/data-files/carcols

## Example File

An example of carcols.meta can be found in `docs/examples/carcols.meta`
