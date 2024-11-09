import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBarItem.text = '$(file-code) MTA Helper';
	statusBarItem.command = 'mta-helper.showOptions';
	statusBarItem.tooltip = 'Click to choose MTA option';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	let disposable = vscode.commands.registerCommand('mta-helper.showOptions', async () => {
		const option = await vscode.window.showQuickPick(['Generate new files', 'Generate meta for existing files'], {
			placeHolder: 'Select an option',
		});

		if (option === 'Generate new files') {
			await generateFiles();
		} else if (option === 'Generate meta for existing files') {
			await generateMetaForExistingFiles();
		} else {
			vscode.window.showErrorMessage('No option selected.');
		}
	});

	context.subscriptions.push(disposable);
}

async function generateFiles() {
	const folderUri = await vscode.window.showOpenDialog({
		canSelectFolders: true,
		canSelectFiles: false,
		canSelectMany: false,
		openLabel: 'Select folder',
	});

	if (!folderUri || folderUri.length === 0) {
		vscode.window.showErrorMessage('No folder selected.');
		return;
	}

	const pickedFiles = await vscode.window.showQuickPick(
		[
			{ label: 'utils.lua', picked: false },
			{ label: 'client.lua', picked: false },
			{ label: 'server.lua', picked: false },
			{ label: 'shared.lua', picked: false },
		],
		{
			canPickMany: true,
			placeHolder: 'Select files to create',
		}
	);

	if (!pickedFiles || pickedFiles.length === 0) {
		vscode.window.showErrorMessage('No files selected.');
		return;
	}

	const includeZoom = pickedFiles.some(file => file.label === 'client.lua')
		? await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Include zoom functionality in client.lua?' }) === 'Yes'
		: false;

	const folderPath = folderUri[0].fsPath;
	const options: { [key: string]: boolean } = pickedFiles.reduce((acc: { [key: string]: boolean }, item: { label: string }) => {
		acc[item.label] = true;
		return acc;
	}, {});

	const createFile = (fileName: string, content: string) => {
		const filePath = path.join(folderPath, fileName);
		fs.writeFileSync(filePath, content.trim());
	};

	Object.keys(options).forEach((file) => {
		let content = `-- ${file}`;
		if (file === 'client.lua') {
			content = includeZoom
				? `
local sx, sy = guiGetScreenSize()
local zoom = (sx < 2048) and math.min(2.2, 2048/sx) or 1

-- Example function using zoom

function render()
	dxDrawRectangle(sx/2 - 200/zoom, sy/2 - 200/zoom, 400/zoom, 400/zoom, tocolor(0, 0, 0, 200))
end

addEventHandler('onClientRender', root, render)
`
				: '-- client.lua';
			createFile('client.lua', content);
		} else {
			createFile(file, content);
		}
	});

	const metaContent = `
<meta>
    ${options['client.lua'] ? '<script src="client.lua" type="client" cache="false" />' : ''}
    ${options['server.lua'] ? '<script src="server.lua" type="server" />' : ''}
    ${options['shared.lua'] ? '<script src="shared.lua" type="shared" cache="false" />' : ''}
    ${options['utils.lua'] ? '<script src="utils.lua" type="shared" cache="false" />' : ''}
</meta>`.trim();

	const metaPath = path.join(folderPath, 'meta.xml');
	fs.writeFileSync(metaPath, metaContent);

	vscode.window.showInformationMessage('Files successfully created!');
}

async function generateMetaForExistingFiles() {
	const folderUri = await vscode.window.showOpenDialog({
		canSelectFolders: true,
		canSelectFiles: false,
		canSelectMany: false,
		openLabel: 'Select folder with script files',
	});

	if (!folderUri || folderUri.length === 0) {
		vscode.window.showErrorMessage('No folder selected.');
		return;
	}

	const folderPath = folderUri[0].fsPath;
	const metaEntries: string[] = [];

	function scanFolder(folder: string) {
		const files = fs.readdirSync(folder);
		files.forEach((file) => {
			const filePath = path.join(folder, file);
			const relativePath = path.relative(folderPath, filePath).replace(/\\/g, '/');
			const stat = fs.statSync(filePath);

			if (stat.isDirectory()) {
				scanFolder(filePath);
			} else if (file.endsWith('.lua')) {
				let scriptType = 'shared';
				if (file.includes('client')) {
					scriptType = 'client';
				} else if (file.includes('server')) {
					scriptType = 'server';
				}
				const cacheAttribute = scriptType === 'server' ? '' : ' cache="false"';
				metaEntries.push(`    <script src="${relativePath}" type="${scriptType}"${cacheAttribute} />`);
			} else {
				metaEntries.push(`    <file src="${relativePath}" />`);
			}
		});
	}

	scanFolder(folderPath);

	const metaContent = `
<meta>
${metaEntries.join('\n')}
</meta>`.trim();

	const metaPath = path.join(folderPath, 'meta.xml');
	fs.writeFileSync(metaPath, metaContent);

	vscode.window.showInformationMessage('meta.xml generated successfully!');
}

export function deactivate() {}
