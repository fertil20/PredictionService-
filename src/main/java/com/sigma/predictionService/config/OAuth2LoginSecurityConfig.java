package com.sigma.predictionService.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;


@Configuration
@EnableWebSecurity
public class OAuth2LoginSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .mvcMatchers("/").permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .oauth2Login()
                    .defaultSuccessUrl("/login/success", true)
                    .failureUrl("/loginFailure")
                ;
    }

}




/*
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
public class OAuth2LoginSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.oauth2Login()
                .redirectionEndpoint()
                .baseUri("/oauth2/redirect");


                .authorizationEndpoint()
					...
				.redirectionEndpoint()
					...
				.tokenEndpoint()
					...
				.userInfoEndpoint()
					...

    }
            }
 */
