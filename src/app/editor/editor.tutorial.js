import Tutorial from "@/components/Joyride";

export default function AppTutorial() {
	return (
		<Tutorial
			uid={"editor-basic-tutorial"}
			steps={[
				{
					target: "#toolbar",
					title: "🔧 Toolbar",
					content: "This is the toolbar. Here, you can use it to import/export files, change the BPM or select a color.",
					disableBeacon: true,
					placement: "left-start",
				},
				{
					target: "#toolbar-import",
					title: "📤 Importing files",
					content: "You can use this button to import your <b>carcols.meta</b> to the editor. This will allow you to edit the colors and direction, for example, and after this, download it back to your computer.",
					disableBeacon: true,
				},
				{
					target: "#toolbar-export",
					title: "📥 Exporting files",
					content: "You can use this button to export your <b>carcols.meta</b> from the editor. This will download the editted file to your computer, and you can use it in your game.",
					disableBeacon: true,
				},
				{
					target: "#toolbar-bpm",
					title: "⏱️ Adjusting the BPM",
					content: "Here, you can adjust the BPM of the editor. This will change the speed of the lights pattern.",
					disableBeacon: true,
				},
				{
					target: "#toolbar-colors",
					title: "🎨 Choosing a nice color",
					content: "You can click on a colored squared to select a color, after this, in the editor and <kbd><kbd>Left Click</kbd></kbd> a <b>Light</b> to change its color or <kbd><kbd>Right Click</kbd></kbd> to remove the color. You can also hold <kbd><kbd>Left Click</kbd></kbd> and drag to paint multiple lights at once.",
					disableBeacon: true,
				},
				{
					target: "main",
					title: "🚩 Separators",
					content: "You can use separators to divide lights into groups. This is useful to create different patterns for different parts of a vehicle, for example. You can add a separator by hitting <kbd><kbd>Q</kbd></kbd> in your keyboard. To remove a separator, just drag it to the drop zone on the left.",
					disableBeacon: true,
					placement: "center",
				},
				{
					target: "#bmc-wbtn",
					title: "💰 Support the project",
					content: "You can support the project by clicking this button. You can also share the project with your friends, it will help a lot! 🙏",
					disableBeacon: true,
				},
			]}
			continuous
		/>
	)
}