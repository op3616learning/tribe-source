/* eslint-disable max-classes-per-file */
import { ApolloError } from '@apollo/client'
import { GraphQLError } from 'graphql'

import { ApolloApis } from 'tribe-api'

export class PermissionError extends Error {
  code: number

  scopes: ApolloApis[]

  constructor(scopes?: ApolloApis[], message?: string) {
    super(message)
    this.name = 'PermissionError'
    this.message = message || 'No Permission'
    this.code = 403

    this.scopes = scopes || []
  }
}

export class ServerError extends Error {
  code: number

  graphQLErrors: ReadonlyArray<GraphQLError>

  extraInfo: any

  constructor(error?: ApolloError | Error) {
    super(error?.message)
    this.name = error?.name || 'ServerError'
    this.message = error?.message || 'Internal Server Error'
    this.stack = error?.stack
    this.graphQLErrors = (error as ApolloError)?.graphQLErrors
    this.extraInfo = (error as ApolloError)?.extraInfo
    this.code = 500
  }
}
