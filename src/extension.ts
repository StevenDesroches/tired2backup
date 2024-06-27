import * as vscode from 'vscode';
import * as fs from 'fs';

const TIRED2BACKUP_CONFIG: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('tired2backup');
const INITIALS = TIRED2BACKUP_CONFIG.get('initials');
const BACKUP_FOLDER_NAME = TIRED2BACKUP_CONFIG.get('backup.folder.name');

export function activate(context: vscode.ExtensionContext) {
	const tired2backupCreateCommand = vscode.commands.registerCommand('tired2backup.create', () => {
		let activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor)
			return;
		create_backup(activeEditor.document.uri.fsPath);
	});
	context.subscriptions.push(tired2backupCreateCommand);
}

function create_backup(path: string) {
	let pathArray = path.split('\\');
	let filename = pathArray.pop();
	if (!filename)//no file, no backup!
		return;

	let fileBasenameArray = filename.split('.');
	let ext = fileBasenameArray.pop() ?? "";
	let fileBasename = fileBasenameArray.join('.');

	let folderPath = pathArray.join('\\');
	let BackupFolderPath = folderPath + `\\${BACKUP_FOLDER_NAME}`;

	if (!fs.existsSync(BackupFolderPath))
		fs.mkdirSync(BackupFolderPath);

	let index = 0;
	let backupFilePath = `${BackupFolderPath}\\${fileBasename}${new Date().toLocaleDateString("en-CA")}-${INITIALS}.${ext}`;
	while (fs.existsSync(backupFilePath)) {
		backupFilePath = `${BackupFolderPath}\\${fileBasename}${new Date().toLocaleDateString("en-CA")}-${INITIALS}_${++index}.${ext}`;
	}
	fs.copyFileSync(path, backupFilePath);
}


// This method is called when your extension is deactivated
export function deactivate() { }
