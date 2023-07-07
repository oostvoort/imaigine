import sqlite3 from 'sqlite3'

import { InsertHistoryLogsParams, InsertInteractionParams, InteractSQLResult, LogSqlResult } from 'types'

const database = new sqlite3.Database(`${process.env.DB_SOURCE}`, err => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
    // Create the "history" and "location_history" tables
    database.serialize(() => {
      database.run(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY,
      counterpart TEXT,
      players TEXT,
      log TEXT
    );
  `)

      database.run(`
    CREATE TABLE IF NOT EXISTS location_history (
      log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      interactable_id TEXT,
      players TEXT,
      mode TEXT,
      by TEXT,
      player_log TEXT
    );
  `)

      database.run(`
    CREATE TABLE IF NOT EXISTS interaction (
      log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      interactable_id TEXT,
      scenario TEXT,
      good_choice TEXT,
      good_effect TEXT,
      evil_choice TEXT,
      evil_effect TEXT,
      neutral_choice TEXT,
      neutral_effect TEXT
    );
      `)
    })

    database.run(`
    CREATE TABLE IF NOT EXISTS history_logs (
      log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      interactable_id TEXT,
      players TEXT,
      mode TEXT,
      by TEXT,
      player_log TEXT
    );
  `)


  }
})

export async function fetchHistoryLogs(entityId: string): Promise<Array<LogSqlResult> | undefined> {
  const sql = `SELECT * FROM history_logs WHERE interactable_id = '${entityId}' ORDER BY log_id ASC`
  return new Promise((resolve, reject) => {
    database.all(sql, (err, rows) => {
      if (err) {
        console.error('Error reading data:', err)
        reject(undefined) // Reject the promise with the error
      } else {
        resolve(rows.map((log: LogSqlResult) => {
          return {
            log_id: log.log_id,
            interactable_id: log.interactable_id,
            players: log.players,
            mode: log.mode,
            by: log.by,
            player_log: log.player_log,
          }
        }))
      }
    })
  })
}

export async function fetchInteraction(entityId: string): Promise<Array<InteractSQLResult> | undefined> {
  const sql = `SELECT * FROM interaction WHERE interactable_id = '${entityId}' ORDER BY log_id DESC`
  return new Promise((resolve, reject) => {
    database.all(sql, (err, rows) => {
      if (err) {
        console.error('Error reading data:', err)
        reject(undefined) // Reject the promise with the error
      } else {
        resolve(rows.map((interaction: InteractSQLResult) => {
          return {
            log_id: interaction.log_id,
            interactable_id: interaction.interactable_id,
            scenario: interaction.scenario,
            good_choice: interaction.good_choice,
            good_effect: interaction.good_effect,
            evil_choice: interaction.evil_choice,
            evil_effect: interaction.evil_effect,
            neutral_choice: interaction.neutral_choice,
            neutral_effect: interaction.neutral_effect,
          }
        }))
      }
    })
  })
}

export async function insertInteraction(insertInteractionParams: InsertInteractionParams) {

  const insertQuery = `
    INSERT INTO interaction (
        interactable_id,
        scenario,
        good_choice,
        good_effect,
        evil_choice,
        evil_effect,
        neutral_choice,
        neutral_effect
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

  database.run(insertQuery, [
    insertInteractionParams.interactable_id,
    insertInteractionParams.scenario,
    insertInteractionParams.good_choice,
    insertInteractionParams.good_effect,
    insertInteractionParams.evil_choice,
    insertInteractionParams.evil_effect,
    insertInteractionParams.neutral_choice,
    insertInteractionParams.neutral_effect,

  ], function (err) {
    if (err) {
      console.error('Error inserting data:', err)
    } else {
      console.log('Data inserted successfully.')
    }
  })
}



export async function insertHistoryLogs(insertHistoryLogsParams: InsertHistoryLogsParams) {

  const insertQuery = `
    INSERT INTO history_logs (
        interactable_id,
        players,
        mode,
        by,
        player_log
    )
    VALUES (?, ?, ?, ?, ?)`

  database.run(insertQuery, [
    insertHistoryLogsParams.interactable_id,
    insertHistoryLogsParams.players,
    insertHistoryLogsParams.mode,
    insertHistoryLogsParams.by,
    insertHistoryLogsParams.player_log,
  ], function (err) {
    if (err) {
      console.error('Error inserting data:', err)
    } else {
      console.log('Data inserted successfully.')
    }
  })
}
