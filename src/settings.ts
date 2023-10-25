import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import LocalBackupPlugin from './main';

export class LocalBackupSettingTab extends PluginSettingTab {
	plugin: LocalBackupPlugin;

	constructor(app: App, plugin: LocalBackupPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Backup once on startup')
			.setDesc('Run local backup once on Obsidian starts.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.startupSetting)
				.onChange(async (value) => {
					this.plugin.settings.startupSetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Backup history length')
			.setDesc('Specify the number of days backups should be retained. (0 -- Infinity)')
			.addText(text => text
				.setValue(this.plugin.settings.lifecycleSetting)
				.onChange(async (value) => {

					// add limits
					const numericValue = parseFloat(value);
					if (numericValue < 0) {
						new Notice('Backup lifecycle must be a non-negative number.');
						return;
					}
					if (isNaN(numericValue)) {
						return;
					}

					this.plugin.settings.lifecycleSetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Output path')
			.setDesc('Setup backup storage path.')
			.addText(text => text
				.setValue(this.plugin.settings.savePathSetting)
				.onChange(async (value) => {
					this.plugin.settings.savePathSetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('File name')
			.setDesc('Name of the backup ZIP file. Default: {vaultName}-Backup')
			.addText(text => text
				.setValue(this.plugin.settings.customizeNameSetting)
				.onChange(async (value) => {
					this.plugin.settings.customizeNameSetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Interval backups')
			.setDesc('Enable to create backups at regular intervals')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.intervalToggleSetting)
				.onChange(async (value) => {
					this.plugin.settings.intervalToggleSetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Backup frequency')
			.setDesc('Set the frequency of backups in minutes (minutes).')
			.addText(text => text
				.setValue(this.plugin.settings.intervalValueSetting)
				.onChange(async (value) => {

					// add limits
					const numericValue = parseFloat(value);
					if (numericValue <= 0) {
						new Notice('Backup intervals must be a positive number.');
						return;
					}
					if (isNaN(numericValue)) {
						return;
					}

					this.plugin.settings.intervalValueSetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.addButton(btn => btn
				.setTooltip('Restore defaults')
				.setButtonText('Restore defaults')
				.onClick(async () => {
					await this.plugin.restoreDefault();
					new Notice('Settings restored to default.');
				})
			)
			.addButton(btn => btn
				.setTooltip('Apply settings now')
				.setButtonText('Apply settings')
				.onClick(async () => {
					new Notice('Applying Local Backup settings.');
					await this.plugin.applySettings();
				})
			);
	}
}
