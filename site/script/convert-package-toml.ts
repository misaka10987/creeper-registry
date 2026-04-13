import { parse as parseToml } from 'smol-toml'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const walkTomlFiles = async function* (
  dirPath: string,
): AsyncGenerator<string> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      yield* walkTomlFiles(fullPath)
      continue
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.toml')) {
      yield fullPath
    }
  }
}

const toPosixRelative = (fromDir: string, filePath: string) => {
  return path.relative(fromDir, filePath).split(path.sep).join('/')
}

const main = async () => {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const repoRoot = path.resolve(scriptDir, '..', '..')

  const packageDir = path.join(repoRoot, 'package')
  const outRoot = path.join(repoRoot, 'site', 'public', 'package')

  const stat = await fs.stat(packageDir).catch(() => null)
  if (!stat?.isDirectory()) {
    throw new Error(`未找到目录: ${packageDir}`)
  }

  let converted = 0
  for await (const tomlFile of walkTomlFiles(packageDir)) {
    const relPosix = toPosixRelative(packageDir, tomlFile)
    const outRel = relPosix.replace(/\.toml$/i, '.json')
    const outFile = path.join(outRoot, ...outRel.split('/'))

    const tomlText = await fs.readFile(tomlFile, 'utf8')
    let data: unknown
    try {
      data = parseToml(tomlText)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      throw new Error(`解析失败: ${relPosix}\n${msg}`)
    }

    await fs.mkdir(path.dirname(outFile), { recursive: true })
    await fs.writeFile(outFile, JSON.stringify(data, null) + '\n', 'utf8')
    converted += 1
  }

  // eslint-disable-next-line no-console
  console.log(
    `已转换 ${converted} 个 TOML -> ${path.relative(repoRoot, outRoot)}`,
  )
}

await main()
